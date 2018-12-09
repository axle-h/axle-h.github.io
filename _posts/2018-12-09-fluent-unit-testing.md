---
layout: post
title:  "Fixture Based Fluent Unit Testing"
logo: fluent-unit-testing/logo.png
banner: fluent-unit-testing/banner.png
date: 2018-12-09 12:00:00 +0000
author: Alex Haslehurst
categories: software development testing
---

Given my last few posts, you'd be forgiven for thinking that this blog has an underlying testing theme. As unintended as it may be, since I've written *yet another* lightweight unit testing framework that works significantly different to my previous [specification structured][spec-testing] approach, I think it qualifies for another post. `given-fixture` is intended to support writing really concise but readable tests built from many small, fluent extension methods that configure a fixture for taking care of all that nasty boiler plate. Me and the rest of my team have written hundreds of unit tests with this. We seem to be having great success and continue to refine it regularly. So please take a look, it's available on [GitHub][github] and [NuGet][nuget].

<!--more-->

[github]: https://github.com/axle-h/given-fixture
[nuget]: https://www.nuget.org/packages/given-fixture
[spec-testing]: {% post_url 2018-02-26-specification-structured-testing %}
[integration-testing]: {% post_url 2018-09-27-fluent-mvc-integration-testing %}
[auto-fixture]: https://github.com/AutoFixture/AutoFixture
[bogus]: https://github.com/bchavez/Bogus
[moq]: https://github.com/moq/moq4
[autofac-moq]: https://github.com/autofac/Autofac.Extras.Moq
[fluent-assertions]: http://fluentassertions.com

## Why?

> What's up with specification structured tests?

I've been writing [specification structured][spec-testing] unit tests in C# for a few years now and other than a few occasions, mainly when testing over ambitious services who's behaviour tree had grown totally out of control, I've had a great experience with them. I like how I can read service behaviours in test logs clearly and identify failure causes within a few lines of code. However, my current team have not been quite so enthused with the extra investment in complexity required to write them. I've started noticing developers ignoring my examples entirely and falling back into free-form tests, sometimes with framework abuse, other times dropping the framework entirely. I can't really blame them as, I've come to realise that specification structured testing is over complicated.

It has taken me writing three testing themed posts to do so but I now believe that I write tests in more of an opinionated style than other developers. I think that this has been caused by some unforgettable past experiences of working with tens of thousands of lines of very badly written free-form tests that reliably violated fundamental programming concepts such as DRY. In my opinion, when fixing unit tests takes orders of magnitude longer than writing application code then your technical debt has reached a critical status. I remember getting away with deleting and disabling entire test classes in order to make my life easier. *No-one reads the tests in pull requests right?*

From this, I think I value test structure, readability and maintainability to a far higher degree than some of my peers, who seem to often consider testing as an afterthought. This has led me to believe that with specification structured testing, I may have engineered too much complexity for it to succeed as a framework. It needed more of a balance between capability, complexity and... as ridiculous as it sounds... beauty. Whilst specifications look great in logs, in code, specification inheritance can get so out of control that they become extremely difficult to read. I think developers prefer to write code that *looks* nice, *feels* cool or seems like a productive use of their time.

## What's Changed?

I recently introduced my team to a new [fluent fixture based integration testing framework][integration-testing] to very positive feedback. Admittingly, we were using Postman based tests before so anything would seem like a revolution, but in comparison to attempts coming from other teams, we were definitely on to a good thing. A fixture based approach was a perfect fit for integration testing as tests written for a particular API or entity type, will follow a very similar pattern.

1. Configure the test server
2. Configure the database, including adding any entities required for the test
3. Make an HTTP request
4. Try to deserialize the HTTP response as JSON
5. Assert against the response
6. Assert against changes in the database

The fixture reduces the boiler plate involved with bootstrapping and calling the test server, whilst the fluent extension based approach allows easy integration with libraries specific to each database technology used by each of our microservices. Most of all, it feels productive to use. With tiny but powerful extension methods like `HavingDatabaseWithEntity`, `WhenMakingRestRequest` and `ShouldReturnJson`, tests are readable and verbose without violating DRY.

## Given Fixture

> Fluent fixtures work great for integration tests but how about unit tests?

The structure of unit tests is not quite as standard as integration tests but there are still patterns that we can observe for writing a fluent process.

1. Generate test data
2. Configure mocks with the test data
3. Optionally construct a subject from the mocks
4. Call a method on the subject or a static method
5. Assert features of the result returned or exception thrown
6. Assert expected mock actions

Using this flow as a base, I have developed `given-fixture`, a really simple library that provides a fixture to configure and assumes a fluent style of writing tests.

### Fluent convention

To develop a successful fluent style, we need a convention for using fluent verbs. For `given-fixture` I went with:

* **Having** for arranging e.g. *Having* some data, *Having* some configured mock.
* **When** for acting e.g. *When* we use a subject to call a method, *When* we call a static method.
* **Should** for asserting e.g. *Should* return a specific value, *Should* throw a specific exception.

The name of each fluent extension should begin with one of these verbs. Since `given-fixture` is configured with a fixture, there is no strict ordering of fluent extension methods, but to keep a clean conversation flow we should always conform to the order "Having", "When", "Should" i.e. arrange, act, assert.

### Generating test data

Some test data must conform to a particular structure in order for our tests to be valid e.g. the test subject might expect URL's or email addresses to be parsed or validated. However, the vast majority of all test data is characterized by us not really caring about the value itself, just that the test subject used it in the expected way to produce the expected result.

For structured data, the excellent [Bogus][bogus] library is perfect. The test fixture in `given-fixture` provides a `Faker` instance so that we can wrap it fluently like so.

{% highlight C# %}
Given.Fixture
     .HavingFake(f => f.Internet.Url(), out var url)
     .HavingFake(f => f.Internet.Email(), out var email)
     .HavingFake(f => f.Random.AlphaNumeric(16), out var knownLength)
     .HavingFake(f => f.Random.Int(1, 10), out var knownRange);
{% endhighlight %}

The Bogus library really fits in with our fluent style.

> "Given fixture", "having fake internet URL" and "having fake random integer"

If a test is often generating data of a particular structure, we may want to wrap it in a new extension method, for example.

{% highlight C# %}
public static ITestFixture HavingUrlWithPath(this ITestFixture fixture,
                                             out string url) =>
    fixture.HavingFake(f => f.Internet.UrlWithPath(), out url);
{% endhighlight %}

For unstructured data we can use [AutoFixture][auto-fixture]. The test fixture in `given-fixture` provides an `IFixture` instance so that we can wrap it fluently like so.

{% highlight C# %}
Given.Fixture
     .HavingModel(out SomeModel model)
     .HavingModels(out ICollection<SomeModel> models)
     .HavingModel(out Guid guid);
{% endhighlight %}

These methods support the composer functionality of AutoFixture.

{% highlight C# %}
Given.Fixture
     .HavingModel(out SomeModel model1, c => c.Without(c => c.SomeProperty))
     .HavingModel(out SomeModel model2, c => c.With(c => c.SomeProperty, "some value"));
{% endhighlight %}

With extensions provided in the library, you can also combine Bogus with AutoFixture to generate structured data in POCO's.

{% highlight C# %}
Given.Fixture
     .HavingModel(out SomeModel model,
                  c => c.With(c => c.Email, f => f.Internet.Email())
                        .With(x => x.Price, f => f.Random.Decimal(10, 20)));
{% endhighlight %}

Again we may want to generate the same sort of data in multiple tests, in which case we would extract a new reusable extension method.

{% highlight C# %}
public static ITestFixture HavingSomeModelWithPrice(this ITestFixture fixture,
                                                    out SomeModel model,
                                                    decimal price) =>
    fixture.HavingModel(out model, c => c.With(x => x.Price, price));
{% endhighlight %}

### Configuring mocks

For mocking dependencies, I have used [Moq][moq] with the repository from [Autofac.Extras.Moq][autofac-moq]. The test fixture in `given-fixture` provides an `AutoMock` instance so that we can wrap it fluently like so.

{% highlight C# %}
Given.Fixture
     .HavingModel(out SomeModel model)
     .HavingMock<ISomeService>(m => m.Setup(x => x.SomeMethodAsync())
                                     .ReturnsAsync(model)
                                     .Verifiable())
     .HavingMock<ISomeService>(m => m.Setup(x => x.SomeOtherMethod())
                                     .Throws(new InvalidOperationException())
                                     .Verifiable());
{% endhighlight %}

I noticed whilst writing tests using these methods that most of the time I was mocking methods to return models or throw exceptions that I had just generated with AutoFixture. So I have included a set of extension methods that cover most of these common cases. Using these extension methods, the above example becomes more concise.

{% highlight C# %}
Given.Fixture
     .HavingMocked<ISomeService, SomeModel>(x => x.SomeMethodAsync(), out model)
     .HavingMockThrow<ISomeService, InvalidOperationException>(x => x.SomeOtherMethod());
{% endhighlight %}

Because this is just wrapping the Moq library you can still use parameter assertions, for example.

{% highlight C# %}
Given.Fixture
     .HavingMocked<ISomeService, SomeModel>(x => x.SomeMethodAsync(It.Is<SomeRequest>(r => r.Name == "some name")),
                                            out model);
{% endhighlight %}

Each of these methods calls the `Verifiable(string because)` method on the mock object. This is a good practice as it asserts all mock actions were actually completed i.e. the test is actually testing the subject behaviour that we expect. After result and exception assertions have completed, the test fixture automatically calls `VerifyAll()` on each configured mock.

### The subject

Once we have all test data ready and all dependent calls mocked out, we need a subject to test. With `given-fixture`, you can use [Autofac.Extras.Moq][autofac-moq] to automatically construct a subject using it's mock repository and the Autofac IoC container. If you are testing instance methods, this is the preferred approach as changes to the constructor signature will not automatically break all tests. The fixture also allows testing without a subject in order to test static methods.

If testing with a subject.

{% highlight C# %}
Given.Fixture
     .When<SomeService, SomeResult>(x => x.SomeMethodAsync());
{% endhighlight %}

Or without a subject.

{% highlight C# %}
Given.Fixture
     .WhenStatic<SomeResult>(() => SomeStaticClass.SomeStaticMethod());
{% endhighlight %}

### Assertions

For asserting features of the result, the fixture provides `ShouldReturn` and for the thrown exception, `ShouldThrow`. The library also provides a selection of common assertion extension methods using the excellent [FluentAssertions][fluent-assertions] library.

{% highlight C# %}
Given.Fixture
     .ShouldReturnEquivalent(new { Name = "some name", Price = 10.0m });
{% endhighlight %}

These also include common exception assertions for example.

{% highlight C# %}
Given.Fixture
     .ShouldThrowArgumentException("request");
{% endhighlight %}

### Running the fixture

Up to this point, we have only been configuring the fixture. We must call either `Run` or `RunAsync` to run the fixture depending on whether the act step is asynchronous.

{% highlight C# %}
public Task When_calling_some_async_method() =>
     Given.Fixture
          .When<SomeService, SomeResult>(x => x.SomeMethodAsync())
          .RunAsync();
{% endhighlight %}

For synchronous methods.

{% highlight C# %}
public void When_calling_some_sync_method() =>
     Given.Fixture
          .When<SomeService, SomeResult>(x => x.SomeMethod())
          .Run();
{% endhighlight %}

The fixture will throw if you attempt to use the incorrect run method for your act step.

### Full example

Imagine that we have `BreakfastService`, a service for creating breakfasts. This is simply naming and pricing collections of breakfast items.

{% highlight C# %}
public class BreakfastService
{
    private readonly IBreakfastItemRepository _breakfastItemRepository;

    public BreakfastService(IBreakfastItemRepository breakfastItemRepository)
    {
        _breakfastItemRepository = breakfastItemRepository;
    }

    public async Task<Breakfast> GetBreakfastAsync(GetBreakfastRequest request)
    {
        if (request == null)
        {
            throw new ArgumentNullException(nameof(request));
        }

        // Make sure we have some breakfast items.
        if (request.BreakfastItems == null || !request.BreakfastItems.Any())
        {
            throw new ArgumentException("All breakfasts must have breakfast items", nameof(request));
        }

        // Get the breakfast items.
        var itemTasks = request.BreakfastItems
                               .Distinct()
                               .Select(_breakfastItemRepository.GetBreakfastItemAsync);
        var items = await Task.WhenAll(itemTasks);

        // Ensure we have all items.
        if (items.Any(x => x == null))
        {
            return null;
        }

        // Make the breakfast.
        return new Breakfast
               {
                   Price = items.Sum(i => i.Price),
                   Name = GetBreakfastName(items)
               };
    }

    private static string GetBreakfastName(ICollection<BreakfastItem> items)
    {
        var itemTypes = items.Select(x => x.Type).ToList();

        // Check for full english breakfast.
        var isFullEnglish = Enum.GetValues(typeof(BreakfastItemType))
                                .Cast<BreakfastItemType>()
                                .All(itemTypes.Contains);
        if (isFullEnglish)
        {
            return "Full English Breakfast";
        }

        // Check for breakfast items on toast.
        if (itemTypes.Contains(BreakfastItemType.Toast))
        {
            var notToast = items.Where(x => x.Type != BreakfastItemType.Toast).ToList();
            var toast = items.Except(notToast).First();
            return $"{GetItemNames(notToast)} on {toast.Name}";
        }

        // Fall back to a list of all items.
        return GetItemNames(items);
    }

    private static string GetItemNames(IEnumerable<BreakfastItem> items) =>
        Regex.Replace(string.Join(", ", items.Select(i => i.Name)), ",(?=[^,]*$)", " and");
}
{% endhighlight %}

First of all, each test will share common test fixture configuration steps, such as configuring the subject and method to call. To avoid repeating ourselves in code we should wrap these in extension methods.

{% highlight C# %}
internal static class BreakfastTestExtensions
{
    /// <summary>
    /// Configures the mock breakfast item repository to return a relevant breakfast item
    /// when called with the specified breakfast item type.
    /// </summary>
    public static ITestFixture HavingBreakfastItem(this ITestFixture fixture, BreakfastItemType type, out BreakfastItem item) =>
        fixture.HavingMocked<IBreakfastItemRepository, BreakfastItem>(x => x.GetBreakfastItemAsync(type),
                                                                      out item,
                                                                      c => c.With(x => x.Type, type)
                                                                            .With(x => x.Name, type.ToString()));


    /// <summary>
    /// Configures the fixture to construct a <see cref="BreakfastService"/> subject
    /// and call <see cref="BreakfastService.GetBreakfastAsync"/> with the specified breakfast item types.
    /// </summary>
    public static ITestFixture WhenGettingBreakfast(this ITestFixture fixture, params BreakfastItemType[] types) =>
        fixture.When<BreakfastService, Breakfast>(x => x.GetBreakfastAsync(new GetBreakfastRequest { BreakfastItems = types }));

    /// <summary>
    /// Configures the fixture to assert that the subject returns a breakfast with the specified name
    /// and price as calculated from the specified breakfast items.
    /// </summary>
    public static ITestFixture ShouldReturnBreakfastWithCorrectNameAndPrice(this ITestFixture fixture,
                                                                            string expectedName,
                                                                            params BreakfastItem[] expectedItems) =>
        fixture.ShouldReturnEquivalent(new Breakfast { Name = expectedName, Price = expectedItems.Sum(i => i.Price) });
}
{% endhighlight %}

Our first tests should assert that relevant argument exceptions are thrown when calling the service with bad arguments.

{% highlight C# %}
[Fact]
public Task When_attempting_to_get_breakfast_with_null_request() =>
    Given.Fixture
         .When<BreakfastService, Breakfast>(x => x.GetBreakfastAsync(null))
         .ShouldThrowArgumentNullException("request")
         .RunAsync();

[Fact]
public Task When_attempting_to_get_breakfast_with_no_items() =>
    Given.Fixture
         .WhenGettingBreakfast()
         .ShouldThrowArgumentException("request")
         .RunAsync();
{% endhighlight %}

Next we should test the happy path.

{% highlight C# %}
[Fact]
public Task When_getting_bacon_egg_and_sausage() =>
    Given.Fixture
         .HavingBreakfastItem(BreakfastItemType.Bacon, out var bacon)
         .HavingBreakfastItem(BreakfastItemType.Egg, out var egg)
         .HavingBreakfastItem(BreakfastItemType.Sausage, out var sausage)
         .WhenGettingBreakfast(BreakfastItemType.Bacon,
                               BreakfastItemType.Egg,
                               BreakfastItemType.Sausage)
         .ShouldReturnBreakfastWithCorrectNameAndPrice("Bacon, Egg and Sausage",
                                                       bacon, egg, sausage)
         .RunAsync();
{% endhighlight %}

Finally we should write tests for behaviours that are not represented by the happy path i.e. code in the service that has not been called by any of the above tests. Firstly we need to test the failure when one of the breakfast items cannot be retrieved from the repository.

{% highlight C# %}
[Fact]
public Task When_attempting_to_get_breakfast_with_missing_item() =>
    Given.Fixture
         .HavingMocked<IBreakfastItemRepository, BreakfastItem>(x => x.GetBreakfastItemAsync(BreakfastItemType.Bacon), null)
         .WhenGettingBreakfast(BreakfastItemType.Bacon)
         .ShouldReturnNull()
         .RunAsync();
{% endhighlight %}

Next we have the case where all breakfast items are requested, then we should get a special case of a "Full English Breakfast".

{% highlight C# %}
[Fact]
public Task When_getting_full_english_breakfast() =>
    Given.Fixture
         .HavingBreakfastItem(BreakfastItemType.Bacon, out var bacon)
         .HavingBreakfastItem(BreakfastItemType.Egg, out var egg)
         .HavingBreakfastItem(BreakfastItemType.Sausage, out var sausage)
         .HavingBreakfastItem(BreakfastItemType.Toast, out var toast)
         .WhenGettingBreakfast(BreakfastItemType.Bacon,
                               BreakfastItemType.Egg,
                               BreakfastItemType.Sausage,
                               BreakfastItemType.Toast)
         .ShouldReturnBreakfastWithCorrectNameAndPrice("Full English Breakfast",
                                                       bacon, egg, sausage, toast)
         .RunAsync();
{% endhighlight %}

Next we have the case where not all Full English Breakfast items are requested but the selection includes toast, then we should get a special case of "{items} on Toast".

{% highlight C# %}
[Fact]
public Task When_getting_bacon_and_egg_on_toast() =>
    Given.Fixture
         .HavingBreakfastItem(BreakfastItemType.Bacon, out var bacon)
         .HavingBreakfastItem(BreakfastItemType.Egg, out var egg)
         .HavingBreakfastItem(BreakfastItemType.Toast, out var toast)
         .WhenGettingBreakfast(BreakfastItemType.Bacon,
                               BreakfastItemType.Egg,
                               BreakfastItemType.Toast)
         .ShouldReturnBreakfastWithCorrectNameAndPrice("Bacon and Egg on Toast",
                                                       bacon, egg, toast)
         .RunAsync();
{% endhighlight %}

Finally, we need to make sure that the service is reliably deduplicating breakfast items. *TODO: support multiple items e.g. 2x Bacon*.

{% highlight C# %}
[Fact]
public Task When_getting_duplicate_bacon() =>
    Given.Fixture
         .HavingBreakfastItem(BreakfastItemType.Bacon, out var bacon)
         .WhenGettingBreakfast(BreakfastItemType.Bacon,
                               BreakfastItemType.Bacon)
         .ShouldReturnBreakfastWithCorrectNameAndPrice("Bacon", bacon)
         .RunAsync();
{% endhighlight %}

The complete example is available on [GitHub][github].

## Final Thoughts

So what do you think? Your testing opinions may not align perfectly with mine but surely you consider the idea of using a fixture to fluently test behaviours like this to be damn cool. I think a lot of developers already think in this fluent style, I've even seen methods named with fluent verbs being used half baked in free-form unit tests, so maybe providing a common structure such as `given-fixture` will reliably help you and your team to write clean, reusable and highly maintainable tests.