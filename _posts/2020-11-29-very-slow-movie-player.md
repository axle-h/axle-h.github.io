---
layout: post
title:  "Lockdown Project: £50 Very Slow Movie Player"
logo: very-slow-movie-player/logo.png
banner: very-slow-movie-player/banner.png
date: 2020-11-29 12:00:00 +0000
author: Alex Haslehurst
categories: development raspberry-pi
---

A typical movie is played at 24fps, in 16 million colours over a couple of hours.
The very slow movie player will play a movie at 30 frames **per hour** in 2-colours over days, weeks, months.
I'm not planning to sit back with my popcorn and actually watch a movie on this thing. 
Instead, think of it as an attempt to create something interesting enough to be displayed from some very compromised, low power hardware.
I think that, mounted in a nice frame you could almost call it *art*.
Imagine the legendary Jack Rabbit Slim scene from Pulp Fiction slowly being revealed over a couple of weeks - the
uncomfortable silence literally lasting an entire day. Epic.

All code is available on my [Github][github].

<!--more-->

[github]: https://github.com/axle-h/vsmp
[pi-zero]: https://www.raspberrypi.org/products/raspberry-pi-zero/?resellerType=home
[waveshare]: https://www.waveshare.com/7.5inch-e-paper-hat.htm
[waveshare-github]: https://github.com/waveshare/e-Paper/tree/master/RaspberryPi%26JetsonNano/c
[ikea]: https://www.ikea.com/gb/en/p/ribba-frame-black-10378445
[toms-vsmp]: https://debugger.medium.com/how-to-build-a-very-slow-movie-player-in-2020-c5745052e4e4
[toms-bad-seek]: https://github.com/TomWhitwell/SlowMovie/blob/e66293e204ef933f284a5d8c8cdcee7fb99e0594/slowmovie.py#L21
[toms-frame-seek]: https://github.com/TomWhitwell/SlowMovie/blob/e66293e204ef933f284a5d8c8cdcee7fb99e0594/slowmovie.py#L166
[python-c]: https://docs.python.org/3/extending/extending.html
[floyd]: https://en.wikipedia.org/wiki/Floyd%E2%80%93Steinberg_dithering
[wiringpi]: http://wiringpi.com/wiringpi-deprecated
[pi-low-power]: https://www.jeffgeerling.com/blogs/jeff-geerling/raspberry-pi-zero-conserve-energy
[pi-gpio]: https://www.raspberrypi.org/documentation/usage/gpio
[pi-spi]: https://www.raspberrypi.org/documentation/hardware/raspberrypi/spi/README.md
[pi-readonly]: https://medium.com/swlh/make-your-raspberry-pi-file-system-read-only-raspbian-buster-c558694de79

## Project

This has been the perfect lockdown project, cheap & dead easy to assemble with plenty of coding at a level far exceeding the comfort zone of my day job.
Whilst digging out the pointer arithmetic or suffering through the horrendous C++ documentation that assumes you're Linus Torvalds,
it's been great to be reminded just how much crap higher level platforms like Node & Java hide from us.

I currently have my very slow movie player set up in the office burning through my wedding video at (effectively) 60 frames per hour.
By my maths that's a playtime of ~19 days. Here's the guts of it.

![Guts of the Very Slow Movie Player](/assets/images/very-slow-movie-player/guts.jpg)

Certainly not pretty from behind then. I built it with.

* [Raspberry Pi Zero][pi-zero]
  This I paid £5 for back in 2015 and booted it for the first time for this project!
  Full size & faster models are total overkill on cost & power consumption.
  If you're buying new, you'll probably be paying an extra £5 for a Zero W with WiFi built in,
  which is totally worth it for debugging and for access to NTP in lue of a realtime clock on the Pi.
  If you're wanting to save even more power, then you can [disable stuff not needed][pi-low-power] like the HDMI and LEDs.
* [Waveshare 7.5inch, 800x480 E-Ink display HAT for Raspberry Pi][waveshare]
  Direct from Shenzhen, I paid £40, which is an actual bargain. 
  You even get a Raspberry Pi GPIO connector, and they have (not perfect) examples written in C for the Raspberry Pi up on
  [Github][waveshare-github].
  This is an e-paper display, the same technology on Kindles, so it has no backlight and is only actively powered when refreshing the display.
  In all other respects, it is totally compromised. It displays in 2 colours, black & white-ish and has a maximum refresh rate of 0.5hz. 
* [10x15 cm RIBBA frame from IKEA][ikea]
  These are <£2. Probably now worth the 40-minute lockdown queue, but you definitely need the depth of this specific frame.
  The visible area is fine but not perfect.
  I think the screen is a weird enough size that the only way to achieve perfection would be to get it professionally mounted.
* A spare USB power supply, SD card, hot glue and non-conductive tape.
* [Some very efficient code][github] to decode movies on the Raspberry Pi and push frames to the display.

Total project cost was ~£50.

The idea for this was based on an [existing article by Tom Whitwell][toms-vsmp].
My hardware implementation is almost identical except I wanted to go far cheaper.
For software, I started looking at Tom's repository and whilst it provided a great starting point, I found it too slow to be usable on my ~20x slower Pi Zero!
It [seeks from the start of the video for every frame][toms-bad-seek]
and [I'm not convinced that it is actually stepping through frames one-by-one][toms-frame-seek].
I don't think there's a simple way of fixing this in Python as it would need a low level wrapper around ffmpeg with direct access to frame structs.
You'd probably have to write an [extension in C/C++][python-c] relegating Python to scripting duties (best place for it IMO),
so may as well just go full C++ for such a small application.

The world of C++ standards is very difficult to follow, so I'll make it simple for you.
C++14 is the latest supported by the C++ compiler bundled with Debian Buster, which Raspbian is based on.
Don't waste your time writing C++17 like I did only to find it will not compile on the Pi.
If you're interested to know, switching from Python to calling `libav` natively in C++ is an order of magnitude faster!
Python is so slow.

## How it works

The low level process is straight forward.

1. Fetch the next frame of video - I'm using the ffmpeg backend libraries, `libavformat` & `libavcodec`.
   The application steps through each non-black frame one-by-one.
   No seeking from the beginning each time and no trusting ffmpeg to find the right data packet containing the next frame.
2. Scale the frame to fit on the e-paper display & convert to grayscale for simple pixel manipulation - I'm using the `libswscale` library for this, which is also from ffmpeg.
3. Dither into a 1-bit image. *see explanation below*
4. Update the e-paper display.
5. Keep a state file up-to-date on disc so that if the system loses power, we can continue from the exact same frame.
6. Sleep until it's time to display the next frame & repeat.

## Dithering

Black & white e-paper displays have a 1-bit per pixel format i.e. each pixel is either on or off.
There is no support for displaying grayscale images, which would require varying the brightness of each pixel.

If we were to naively down-sample video frames to 1bpp without dithering (i.e. `intensity > 50% ? white : black`) then the result would lose much of its apparent range of luminance.
Extreme banding artifacts would be present where pixel intensities are quantised into binary values without consideration for error i.e. two pixels with intensity values of 51% & 99% would be quantised into identical values.
Dithering algorithms work by reintroducing quantisation error across groups of neighbouring pixels back into the image.
This creates a noticable pattern in the image that effectively sacrifices resolution to increase the apparent range of luminance.

A decent general purpose algorithm for dithering images and the one I'm using here is [Floyd Steinberg][floyd].
This algorithm is a simple forward convolutional filter and very easy to implement from the pseudo code on Wikipedia.

This is best seen through example. Here's a nice (!) frame from my wedding video.

![Example Frame in RGB](/assets/images/very-slow-movie-player/rgb.png)

If we convert this to grayscale then it's still perfectly recognisable.

![Example Frame in Grayscale](/assets/images/very-slow-movie-player/gray.png)

Taking the naive approach to 1bpp quantisation, we get this monstrosity.

![Example Frame in 1-bit Without Dithering](/assets/images/very-slow-movie-player/gray-1.png)

Finally, dithering to 1bpp with the Floyd Steinberg algorithm, the result is still compromised but significantly clearer - certainly less Halloween.
*Note that this image can look absolutely terrible when scaled, so just trust me if you're viewing it on a mobile device!*

![Example Frame in 1-bit Via Floyd Steinberg Dithering](/assets/images/very-slow-movie-player/dithered.png)

## Connecting to the display

The Waveshare e-paper displays connect via SPI and three extra GPIO pins for reset, busy & data/command select signals.
What really helped me pull the trigger on this project was their [Github repository of examples][waveshare-github].
Thanks to this, once connected I was rewarded within 5 minutes (about how long it takes to compile on a Pi Zero!) with a test pattern on the screen.

The fun ended there and I was strongly reminded to **never silently swallow an error**.
Error checking and reporting is very minimal in their examples and there's a lot of noise to wade through.
An example was the use of the SPI chip select signal.
When SPI is enabled on the Raspberry Pi, the SPI driver takes over it so you cannot manually control it like any other GPIO pin.
The examples in this repository have SPI setup to control the chip select signal correctly, but then also attempt to manually write to it.
They get away with this as they swallow all errors generated during GPIO operations.
This slows the application down and means that when someone uses the example as documentation like I did, that person will question their ability to count, read and finally their sanity.

Also note that the examples default to using the WiringPi library as an SPI & GPIO driver but this is
[deprecated][wiringpi] and the Raspberry Pi foundation also [recommend][pi-gpio] against libraries like [this][pi-spi].
You should instead interact with the kernel directly via `ioctl`.

All of this fun along with my choice of C++ over C meant that I ended up completely reimplementing the e-paper display driver.
That means that this project is coupled to the [7.5inch V2][waveshare] model.
Conversion wouldn't be horrendous, it'd just be a case of parsing the Waveshare example for your particular display model and reimplementing their signaling.
From a cursory glance I cannot see any fundamental difference between any display model and mine that would make this impossible.
Instead, differences seem to be data related e.g. one might send a different sequence of bytes during initialisation
and any non 7-inch screens will expect a different sized data buffer.

## Installing

First make sure the `pi` user account is in the `gpio` user group.

```bash
sudo usermod -a -G gpio pi
``` 

Install dependencies.

```bash
sudo apt install build-essential git cmake libavcodec-dev libavformat-dev libswscale-dev
```

Clone and build.

```bash
git clone https://github.com/axle-h/vsmp.git
cd vsmp 
mkdir build && cd build
cmake -D CMAKE_BUILD_TYPE=Release ..
make
```

Probably go and make a cup of tea.

Test the connection to the display.

```bash
./vsmp --test
```

On first run `options.json` is written to `~/.vsmp`. Values are.

* **path** Absolute path to the folder containing movie files to play.
* **width** Visible width of the e-paper display.
* **height** Visible height of the e-paper display.
* **offsetX** Number of pixels to offset the display by horizontally.
* **offsetY** Number of pixels to offset the display by vertically.
* **frameSkip** Number of non-black frames to skip over between each displayed frame.
* **displaySeconds** Minimum number fo seconds to display each frame for.
* **schedule**
  * **enabled** Enables the schedule. Do not enable this unless you have an active connection to the internet.
    The Raspberry Pi has no RTC so you must have access to NTP for this to work. 
  * **hourFrom** Hour of the day to start displaying frames from.
  * **hoursFor** Number of hours each day to display new frames.

Note that e-paper displays are good for a finite number of screen refreshes before developing dead/stuck pixels so be conservative with how often you display new frames.

Change what you need and repeat until the test pattern only just fills the visible area of the screen. 

Once you're happy, drop some `.mp4` files in the configured movies directory and install with.

```bash
sudo make install
```

A new `vsmp` systemd service will be installed and enabled at boot. View service logs with. 

```bash
systemctl status vsmp
```

Once you're all setup and running I strongly recommend that you follow a guide to limit SD card writes as much as possible.
[This is a good one][pi-readonly], although I wouldn't go as far as to actually mount the filesystem read only as the app
needs to write state to disc in order to keep track of progress.

## Developing on macos

Obviously you cannot write to a display but you can build and test movie handling, scaling & dithering.
Required dependencies.

```bash
xcode-select --install
brew install cmake pkg-config ffmpeg
```
