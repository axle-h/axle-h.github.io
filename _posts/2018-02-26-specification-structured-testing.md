---
layout: post
title:  "Specification structured testing"
logo: specification-structured-testing/logo.jpg
date:   2018-02-26 17:30:00 +0000
author: Alex Haslehurst
categories: software development testing
---

Unit testing on .NET Core is pretty opinionated and messy. The wide range of frameworks and the lack of a standard structure beyond Arrange, Act, Assert doesn't help much.
My .NET unit testing opinions are well rooted in what I like to call specification structured testing.
To support this, I've pulled together a library of base classes that provide a standard for writing concise unit tests in a specification structure, whilst leveraging existing frameworks and tooling.
You can find it on [GitHub][github] and [NuGet][nuget].

<!--more-->

[github]: https://github.com/axle-h/xunit-spec
[nuget]: https://www.nuget.org/packages/xunit.spec
[xunit-spec-automapper]: https://github.com/axle-h/xunit-spec-automapper
[xunit-spec-automapper.nuget]: https://www.nuget.org/packages/xunit.spec.automapper
[xunit]: https://xunit.github.io
[NUnit]: http://nunit.org
[MSTest]: https://github.com/Microsoft/testfx
[NSpec]: https://github.com/nspec/NSpec
[machine.specifications]: https://github.com/machine/machine.specifications
[Autofac]: https://autofac.org
[Moq]: https://github.com/moq/moq4
[NSubstitute]: http://nsubstitute.github.io
[FluentAssertions]: http://fluentassertions.com
[Shouldly]: https://github.com/shouldly/shouldly
[AutoFixture]: https://github.com/AutoFixture/AutoFixture
[Bogus]: https://github.com/bchavez/Bogus
[Autofac.Extras.Moq]: https://github.com/autofac/Autofac.Extras.Moq
[SpecFlow]: http://specflow.org
[Retro.Net]: https://github.com/axle-h/Retro.Net
[AutoMapper]: https://automapper.org

## The problem

We should all be familiar with the sensible Arrange, Act, Assert (AAA) pattern, which encourages developers to write unit tests in an explicit, modular structure. Stuff like this can only be good but when did you last read some decent material dedicated to the structuring of test classes? The lack of this means that every developer writes unit tests in a slightly different way - I call this free-form or flat unit testing. I have on numerous occasions been the victim of spending far too much time attempting to reverse engineer the thoughts of the original developer of some probably very technically sound unit tests that are so obtuse that they have become unmaintainable. I have cursed to myself whilst consulting the history, already considering a strongly worded Slack message when unbelievably the name responsible for that entire dirty, dirty unit test file is my own. Ergh. What can we do about this? How about we define a structure for our unit tests and stick to it.

## Frameworks, lots of them

A large factor that divides .NET Core developer opinions in regards to unit testing is the lack of a decent quality, fully featured, Microsoft backed framework to work with. Scala for instance has ScalaTest and Angular has Jasmine. Both of these include support for rich methodologies such as BDD, fixtures, fluent assertions and either direct mocking/spy support or deep integration with well supported mocking frameworks. In .NET Core we have to construct a Frankenstein solution from a unit testing framework such as [MSTest][MSTest], [xunit][xunit] or [NUnit][NUnit], a mocking framework such as [Moq][Moq] or [NSubstitute][NSubstitute], a fake data library such as [AutoFixture][AutoFixture] or [Bogus][Bogus] and an assertions library such as [FluentAssertions][FluentAssertions] or [Shouldly][Shouldly]. Unit tests written against a combination of all of these end up with slight overlaps such as asserting calls on the mocking library whilst also asserting results of service functions with the assertion library.

So the first step of cleaning up the mess for all development teams should be to decide exactly which frameworks to use everywhere and stick with them. A NuGet meta package like `Microsoft.AspNetCore.All` could work. But why stop there? How about we define some common functionality in this package so that all of our unit tests can either inherit from or consume a common set of tools.

### Unit test framework

Microsoft provides [MSTest][MSTest], which is a clear improvement over V1 but is still a bit too wordy for my liking, whilst lacking features such as class fixtures and asynchronous lifetime events. Then there's [NUnit][NUnit], which has only recently joined back in with MSBuild based .NET Core support. I prefer this over MSTest as it has a richer feature set. However, it's still quite wordy and it runs on a context per class i.e. a test class instance is reused for each unit test. I don't like this as it provides a dangerous path to coupled tests. I much prefer [xunit][xunit], the latest framework to come from the original developer behind NUnit. It simplifies loads of stuff, removes all of the wordy attributes and uses a context per unit test i.e. every test runs in a separate instance of the test class. It's also backed well by Microsoft, who provide project templates in the default Visual Studio 2017 installation.

### Mocking library

I'd like to structure my unit tests as specifications and to do so I require an auto mocked subject (more on that later) so choosing a mocking library has already been done for me by the excellent [Autofac.Extras.Moq][Autofac.Extras.Moq]. This is based on [Autofac][Autofac] and [Moq][Moq] so I'm tied into Moq for my mocking library. I'm happy with this, I've used it for many years dating back pre .NET Core and never had an issue with it.

### Assertion library

Xunit provides basic assertions but these are no good for specification structured tests, which work far better with nice fluent "it should" type assertions.
I prefer the API of [FluentAssertions][FluentAssertions] over [Shouldly][Shouldly] as it can chain up calls really nicely.

{% highlight C# %}

// Complex assertions with Shouldly can be messy.
someVariable.ShouldSatisfyAllConditions(() => someVariable.ShouldNotBeNull(),
                                        () => someVariable.ShouldBeSameAs(someOtherVariable));

// Complex assertions with FluentAssertions are very concise.
someVariable.Should().NotBeNull().And.BeSameAs(someOtherVariable);

{% endhighlight %}

### Test data library

For complex test data, I like to use [AutoFixture][AutoFixture], which has finally been ported to .NET Core. I also like to use [Bogus][Bogus] for generating context aware test data e.g. user names, email addresses, URL's. Bogus is a tiny library anyway so I'm happy to include both.

{% highlight C# %}

// AutoFixture is really useful for generating POCO's with little configuration.
var fakePoco = Fixture.Create<Poco>();

// Whereas Bogus is very good at context aware stuff.
var url = Fake.Internet.Url();
var validUri = Uri.TryCreate(url, UriKind.Absolute, out var uri); // true

{% endhighlight %}

## Behaviour driven development

The specification structure comes from behaviour driven development (BDD). I'm not interested in the whole BDD approach, including stories and "should behave like" style assertions as free-form unit test frameworks such as [xunit][xunit] do not support it. There are some .NET unit test frameworks that can be used to go full blown BDD such as [NSpec][NSpec] and [machine.specifications][machine.specifications] but these come at the cost of poor tooling including no dotnet CLI support and deep vendor lock in. One step further would be fully featured BDD frameworks like [SpecFlow][SpecFlow], which are written in cross business legible syntax. The problem with these is that the tests are written in an entirely different language from the application code, are not run from the IDE and are not part of the same solution so things like refactorings will not work.

The whole idea behind specification based testing is to define your tests in terms of the behaviours of a single subject. In a microservice architecture, a subject is most likely to be a service, repository or controller but could also be an automapper profile or the DI container. Behaviours are most likely to be defined by the result of calling a method on the subject. We can best think of these behaviours in a hierarchical flow:

* **When** we use a service to do an action
  * **And** the data has feature A
    * **Then** it should not return null
    * **Then** it should do something specific to feature A
    * **Then** it should not do something specific to feature B
  * **And** the data has feature B
    * **Then** it should not return null
    * **Then** it should do something specific to feature B
    * **Then** it should not do something specific to feature A
  * **And** there is no data
    * **Then** it should return null
    * **Then** it should not throw (implied)

The idea is that it's almost conversation. This really helps future developers understand what you meant your tests to actually test, failures to be more descriptive and the structure of tests to be more concise.

Although this specification style structure is associated with unit tests written for BDD, the concept alone is not BDD. Instead I like to call it BDD-lite.

## BDD-Lite

If we take the concept of specification structured tests from BDD and leverage the tooling of existing unit testing frameworks, we get what I like to call BDD-lite. This is not a new framework, nothing needs to change on developer machines or in CI, it's a simple set of standards for structuring unit tests more concisely.

When introducing BDD-lite to a team, it should be the encouraged approach but entirely optional. Specification structured testing lends itself really well to the CRUD style applications that we see in modern microservice architectures but doesn't do so well in situations that require a complicated fixture as the specification itself requires exclusive control of it. For example, the unit tests in my [.NET Core GameBoy emulator Retro.Net][Retro.Net] require a very complicated fixture to setup and teardown an environment around the CPU core so they do not use specification style testing.

## Example

Imagine that we have a breakfast service that makes bacon sandwiches (because why not):

{% highlight C# %}

public class BreakfastService
{
    private readonly IBaconRepository _baconRepository;
    
    public BreakfastService(IBaconRepository baconRepository)
    {
        _baconRepository = baconRepository;
    }

    /// <summary>
    /// Make a bacon sandwich for the specified owner with the specified preference for smoked bacon.
    /// </summary>
    /// <param name="preferSmokedBacon">if set to <c>true</c> then we prefer smoked bacon.</param>
    /// <param name="owner">The desired owner of the bacon sandwich.</param>
    /// <returns>A bacon sandwich or <c>null</c> if no bacon is available.</returns>
    public async Task<BaconSandwich> MakeMeABaconSandwichAsync(bool preferSmokedBacon, string owner)
    {
        var bacon = await _baconRepository.TakeBaconOfPreferredTypeAsync(preferSmokedBacon);
        if (bacon == null)
        {
            return null;
        }

        // The bacon sandwich is only yummy if we got our preferred type of bacon.
        var isYummy = bacon.IsSmoked == preferSmokedBacon;
        return new BaconSandwich
                {
                    IsYummy = isYummy,
                    Owner = owner
                };
    }
}

{% endhighlight %}

This example needs a bacon class, a bacon sandwich class and a bacon repository interface (that's a lot of bacon :-)):

{% highlight C# %}

public class Bacon
{
    public bool IsSmoked { get; set; }
}

public class BaconSandwich
{
    public bool IsYummy { get; set; }

    public string Owner { get; set; }
}

public interface IBaconRepository
{
    /// <summary>
    /// Gets and removes a slice of bacon from this bacon repository, hopefully of the preferred type, or null we've already eaten it all :-(.
    /// </summary>
    /// <param name="preferSmoked">if set to <c>true</c> then we'll try to get smoked bacon, but we may still return un-smoked. Sorry.</param>
    /// <returns>A slice of bacon, or null if we've already eaten it all.</returns>
    Task<Bacon> TakeBaconOfPreferredTypeAsync(bool preferSmoked);
}

{% endhighlight %}

We can represent the behaviours of `MakeMeABaconSandwichAsync` in a hierarchical flow as before:

* **When** we use the breakfast service to make me a bacon sandwich
  * **And** there is bacon of the correct type available
    * **Then** it should not return null
    * **Then** it should belong to the correct person
    * **Then** it should be yummy
  * **And** there is bacon available but not of the correct type
    * **Then** it should not return null
    * **Then** it should belong to the correct person
    * **Then** it should not be yummy
  * **And** there is no bacon available
    * **Then** it should return null
    * **Then** it should not throw (implied)

### Free form unit test

If we were to test `MakeMeABaconSandwichAsync` with AAA structured, flat unit tests then we could write each coarse behaviour as an independent unit test, the fine behaviours would be represented by assertions at the end of each test method.

{% highlight C# %}

public class BreakfastServiceTests
{
    private static readonly Fixture Fixture = new Fixture();

    [Fact]
    public async Task TestMakingAYummyBaconSandwich()
    {
        var owner = Fixture.Create<string>();
        var bacon = Fixture.Create<Bacon>();

        var baconRepository = Mock.Of<IBaconRepository>();
        Mock.Get(baconRepository)
            .Setup(x => x.TakeBaconOfPreferredTypeAsync(bacon.IsSmoked))
            .ReturnsAsync(bacon)
            .Verifiable();

        var service = new BreakfastService(baconRepository);
        var result = await service.MakeMeABaconSandwichAsync(bacon.IsSmoked, owner);

        result.Should().NotBeNull();
        result.IsYummy.Should().BeTrue();
        result.Owner.Should().Be(owner);
    }

    [Fact]
    public async Task TestMakingANotSoYummyBaconSandwich()
    {
        var owner = Fixture.Create<string>();
        var bacon = Fixture.Create<Bacon>();

        var baconRepository = Mock.Of<IBaconRepository>();
        Mock.Get(baconRepository)
            .Setup(x => x.TakeBaconOfPreferredTypeAsync(!bacon.IsSmoked))
            .ReturnsAsync(bacon)
            .Verifiable();

        var service = new BreakfastService(baconRepository);
        var result = await service.MakeMeABaconSandwichAsync(!bacon.IsSmoked, owner);

        result.Should().NotBeNull();
        result.IsYummy.Should().BeFalse();
        result.Owner.Should().Be(owner);
    }

    [Fact]
    public async Task TestMakingABaconSandwichWithoutBacon()
    {
        var owner = Fixture.Create<string>();
        var preferSmoked = Fixture.Create<bool>();

        var baconRepository = Mock.Of<IBaconRepository>();
        Mock.Get(baconRepository)
            .Setup(x => x.TakeBaconOfPreferredTypeAsync(preferSmoked))
            .ReturnsAsync(null as Bacon)
            .Verifiable();

        var service = new BreakfastService(baconRepository);
        var result = await service.MakeMeABaconSandwichAsync(preferSmoked, owner);

        result.Should().BeNull();
    }
}

{% endhighlight %}

The unit tests themselves are structured well but that's a lot of boiler plate isn't it. There is definitely scope for extracting some common code out into a function or two. We might extract the arrange, act and assert steps as functions but it would be pretty difficult to keep clean. Believe me I tried.

Imagine a future development of `BreakfastService` started explicitly consuming bread or sauce from separate repositories. We'd have to inject these dependencies, changing the signature of the constructor and the pattern in which we call our dependencies. To fix these unit tests we'd have to change the constructor call and the mock setup in three different places. This is something that we can avoid with specification structured testing.

### Explicit test structure

We should all know that the structure of a (good) test should closely follow the arrange, act, assert pattern. The example tests certainly do this by following a common process:

1. Arrange
   * Create test data i.e. service function inputs and objects returned by dependent services.
   * Construct and configure mocks including setting up any expected behaviours.
   * Create an instance of the service from the mocked dependencies.
2. Act: Call the service method.
3. Assert: Assert features of the result.

This is nice but completely implicit. I.e. a future developer working o n these tests could move some arrange code after the act step in order to force an assertion to pass. Or worse, add another round of acting and asserting, essentially coupling two tests together. If we are writing good tests then why not be more explicit in our test structure? How about we guide developers into this pattern explicitly with a specification-like test structure that looks something like this:

{% highlight C# %}

public class Spec
{
    public void Arrange()
    {
        // Setup specification data.
    }

    public void Act()
    {
        // Use specification data to invoke an action on the subject.
    }

    // Assert something on the result. E.g.
    [Fact] public void Something_should_not_be_null() => "something".Should().NotBeNull();
}

{% endhighlight %}

### Test failure messages

These tests all pass and display like this (in Resharper):

![Free Form Tests Success](/assets/images/specification-structured-testing/free-form-success.png)

This is fine but what happens when we break something. What if some rogue developer starts stealing your bacon sandwiches.

{% highlight C# %}

public async Task<BaconSandwich> MakeMeABaconSandwichAsync(bool preferSmokedBacon, string owner)
{
    var bacon = await _baconRepository.TakeBaconOfPreferredTypeAsync(preferSmokedBacon);
    if (bacon == null)
    {
        return null;
    }

    var isYummy = bacon.IsSmoked == preferSmokedBacon;
    
    // Malicious code.
    if (isYummy)
    {
        owner = "Alex";
        isYummy = false;
    }
    
    return new BaconSandwich
            {
                IsYummy = isYummy,
                Owner = owner
            };
}

{% endhighlight %}

We now get a failure message like this.

![Free Form Tests Fail](/assets/images/specification-structured-testing/free-form-failure.png)

The entire test fails even though some assertions have passed. Here's the assertions from the failing test.

{% highlight C# %}

result.Should().NotBeNull(); // This assertion passed but it's success was implicit
result.IsYummy.Should().BeTrue(); // This assertion failed so an exception was thrown here
result.Owner.Should().Be(owner); // This assertion did not run due to the exception

{% endhighlight %}

There's two major problems here:

  * We can only know that the first assertion did not throw by actually looking at the code.
  * We do not know the result of the last assertion as it didn't actually run.

 Some information about the result of the test has been lost. Using rich assertion libraries such as FluentAssertions can mitigate this slightly with functions that combine assertions, however they can be difficult to write effectively, the result of a failure is a long and difficult to read message. I don't like making life harder for myself, especially when things are going wrong.

Wouldn't it be nice if we could structure our tests to produce messages like this:

![Specification Tests Fail](/assets/images/specification-structured-testing/specification-failure.png)

### Specification testing 

Specification structured testing is all about maintaining explicit, readable test structure whilst providing richer messaging.
My specification structured test library, [xunit.spec][github] consists of base classes for deriving specifications depending on whether your actions are asynchronous and whether your service method returns a result. Back to the example, we can create our own coarse specification to inherit from using a `ResultSpec<TSubject, TResult>`, which is asynchronous and whose act step returns a result:

{% highlight C# %}

public abstract class BaconService_BaconSandwich_Spec : ResultSpec<BreakfastService, BaconSandwich>
{
    private bool _preferSmoked;
    protected string Owner;

    protected virtual bool PreferredBaconAvailable { get; } = true;

    protected virtual bool AnyBaconAvailable { get; } = true;

    protected override Task ArrangeAsync(AutoMock mock)
    {
        Owner = Faker.Name.FullName();
        _preferSmoked = Faker.Random.Bool();

        var bacon = AnyBaconAvailable ? new Bacon { IsSmoked = PreferredBaconAvailable ? _preferSmoked : !_preferSmoked } : null;
        mock.Mock<IBaconRepository>()
            .Setup(x => x.TakeBaconOfPreferredTypeAsync(_preferSmoked))
            .ReturnsAsync(bacon)
            .Verifiable();

        return Task.CompletedTask;
    }

    protected override Task<BaconSandwich> ActAsync(BreakfastService subject) => subject.MakeMeABaconSandwichAsync(_preferSmoked, Owner);
}

{% endhighlight %}

So we now have the top level part of the behaviour tree; we have all the code necessary to setup and call the service with toggles present to send us down each behaviour, all in a concise class. Fine behaviours can be defined by inheritance:

{% highlight C# %}

public abstract class Successfully_making_a_bacon_sandwich : BaconService_BaconSandwich_Spec
{
    [Fact] public void It_should_not_return_null() => Result.Should().NotBeNull();

    [Fact] public void It_should_belong_to_the_correct_person() => Result.Owner.Should().Be(Owner);
}

public class When_successfully_making_a_yummy_bacon_sandwich : Successfully_making_a_bacon_sandwich
{
    [Fact] public void It_should_be_yummy() => Result.IsYummy.Should().BeTrue();
}

public class When_successfully_making_a_not_so_yummy_bacon_sandwich : Successfully_making_a_bacon_sandwich
{
    protected override bool PreferredBaconAvailable { get; } = false;

    [Fact] public void It_should_not_be_yummy() => Result.IsYummy.Should().BeFalse();
}

public class When_attempting_to_make_a_bacon_sandwich_without_bacon : BaconService_BaconSandwich_Spec
{
    protected override bool AnyBaconAvailable { get; } = false;

    [Fact] public void It_should_return_null() => Result.Should().BeNull();
}

{% endhighlight %}

### Auto mocking container

The Spec classes in xunit.spec support the subject pattern by using an auto mocking container. This automatically injects dependencies as mocks into the constructor of a subject so we don't have to construct mocks or call the subject constructor directly. We can configure these mocks in our arrange step. This has the massive advantage that changing the signature of service constructors, which we should do all the time due to DI, does not automatically break tests. It also remove loads of boiler plate code and enables us to only be concerned with the dependent mocks of the behaviour that we're testing. I've used [Autofac.Extras.Moq][Autofac.Extras.Moq], an auto mock container based on Moq for the mocking bit and Autofac for the container bit.

## Bells and whistles

There's some cool stuff that you can do with specification tests. For example, when using [AutoMapper][AutoMapper], profiles are such a black box that it should be a requirement for you to unit test each of them. Check out [xunit-spec-automapper][xunit-spec-automapper] which provides a specification base class configured for testing AutoMapper profiles. E.g. if you had an assembly with loads of profiles like this one:

{% highlight C# %}

public class PocoProfile : Profile
{
    public PocoProfile()
    {
        CreateMap<PocoSource, PocoDestination>();
            .ForMember(x => x.Int, o => o.Ignore());
    }
}

{% endhighlight %}

You’d create an application specific specification base class like this:

{% highlight C# %}

public abstract class ApplicationMappingSpec<TSource, TDestination> : MappingSpec<TSource, TDestination>
{
    protected override ICollection<Type> ProfileTypes { get; } = new[] { typeof(PocoProfile) };
}

{% endhighlight %}

Then you can define mapping specifications like so:

{% highlight C# %}

public class When_mapping_from_PocoSource_to_PocoDestination : ApplicationMappingSpec<PocoSource, PocoDestination>
{
    [Fact] public void It_should_map_string() => Destination.String.Should().Be(Source.String);

    [Fact] public void It_should_not_map_int() => Destination.Int.Should().NotBe(Source.Int);
}

{% endhighlight %}

## Final thoughts

So what do you think? *Actually* don't answer that. I really think that the only way to appreciate the concept of specification structured unit testing is to start writing them. Then fast forward a few months, to when you have to revisit a well tested but neglected microservice and be able to jump right back into your unit test project without having to switch gears to cope with unfamiliar frameworks or parse the structure all over again. Just having a standard structure and set of tools will probably get you most of the way there, the specification structure is just a decent way of formalizing the whole thing.

If you haven't already, please check out [xunit.spec][github].  