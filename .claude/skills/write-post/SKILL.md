---
name: write-post
description: Write, draft, outline or edit a blog post for ax-h.com in Alex's own voice. Use whenever a new article or post is suggested, when an existing post in posts/ is being rewritten or extended, and whenever prose for this site needs to stop reading like it was generated. Covers the repo mechanics (frontmatter, assets, MDX components) as well as voice and anti-slop rules.
---

# Writing a post as Alex

This site is Alex's personal blog. Every post is a first person account of something he
actually built, broke, measured or changed his mind about. The writing is the record of a
real hobby project, so the single most important rule is below.

**Never invent facts.** No made up benchmark numbers, repo URLs, package names, prices,
dates, model versions, quotes or outcomes. If a draft needs a number, a link, a screenshot
or a result, ask Alex for it or leave an explicit `TODO:` marker. A plausible sounding
fabrication is worse than a gap, because a gap gets filled and a fabrication gets published.

Before drafting anything, read two or three of the recent posts in `posts/` end to end
(`2025-07-29-machine-learning-from-scratch.mdx`, `2024-09-15-rust-games.mdx`,
`2025-04-22-diffy.mdx` are the best calibration). The posts from 2020 onwards carry the tone
Alex wants. The 2017 and 2018 posts are useful for how he handles heavy technical explanation
(registers, opcodes, code walkthroughs) but their long, dense paragraphs are not the target.

## Interview first

For a brand new post, do not start writing until you know:

* What was built, and the link to it on GitHub.
* Why he bothered. There is always a motivation, usually "for fun", "I wanted to learn X",
  or a domestic annoyance he decided to over engineer his way out of.
* What went wrong, what he abandoned, and what he would do next.
* Real numbers: costs, generations, scores, token counts, timings, hardware.
* Which images and diagrams exist or need making.

Ask for the missing pieces in one go rather than guessing at them.

## Repo mechanics

Filename must be `posts/YYYY-MM-DD-<name>.mdx`. The date and the post `name` are both parsed
from it.

```mdx
---
title: Machine Learning From Scratch
categories: [ai]
---
```

* `title` is required. `categories` is optional and is prepended to the URL. `legacySlug` is
  only for old posts that already have a dated URL in the wild, never for a new one.
* Every post needs `public/<name>/logo.{png,jpg,gif}` and `banner.{png,jpg,gif}` or the build
  fails. Flag this to Alex, do not attempt to fabricate images.
* Body images resolve against that folder, so `![roughness](roughness.png)` loads
  `/<name>/roughness.png`.
* Components available in MDX: `PostLink`, `PintoraDiagram`, `Latex`, `BarChart`, `LineChart`,
  `CheckList` / `CheckListItem` / `XListItem` / `NewListItem`, plus Chakra's `Box`, `Image`,
  `Badge` and `SimpleGrid`. See `src/components/mdx.tsx`.
* Cross reference other posts with `<PostLink name="rust-games" />` rather than a raw URL.

**One sentence per line.** Every post from 2020 onwards is written with semantic line breaks,
one sentence to a line, no wrapping mid sentence. Match it exactly, it keeps the diffs readable.

Links are inline in the modern posts (`[rustris](https://github.com/axle-h/rustris)`). The
reference style link block at the top of the 2017 and 2018 posts is legacy, do not copy it.

## Structure

A post is a walk through the project in the order the problem was actually solved. The usual
shape:

1. **Opening, two to six lines.** States the thing and the motivation immediately, no throat
   clearing. Often drops the GitHub link in the first few lines. Frequently opens with a
   personal hook: *"I've always wanted to make a game! In fact, to make a game was the reason
   I first opened QBasic on my Dad's 486 PC, some 30 years ago."*
2. **The problem or the target.** What was wrong, or what he was aiming at, often with the
   constraint that made it interesting (no server, a Pi Zero, a laptop instead of an RTX 5090).
3. **The middle.** One `##` section per component, decision or stage. Each section is short,
   two to six short paragraphs, usually with code, a diagram, a table, a chart or an image in it.
4. **Results.** Real data. Charts with the actual numbers, coefficients, scores, screenshots.
   Observations as a bullet list underneath.
5. **A closing section** named `## Final thoughts`, `## Next Steps`, `## Lessons` or
   `## The Code`. Honest about what is unfinished, then a direct line to the reader:
   *"Please do let me know if you end up playing either of these as that'll make my day!"*,
   *"give it a star ⭐"*, *"Happy over-engineered blogging 😀."*, *"What do you think?"*

Headings are short noun phrases, two or three words: `## Dithering`, `## Move Search`,
`## Pain points`, `## The package`, `## Massive diffs`. Sentence case is the default. Title
case appears on genuinely technical section names (`## Linear Model Training`) and is fine, but
never title case an ordinary English phrase. Never write a `## Conclusion` or an
`## Introduction`.

Do not follow a heading with a one line restatement of the heading. Get into the content.

## The voice

Read these as the calibration target, they are all his:

> This has been the perfect lockdown project, cheap & dead easy to assemble with plenty of
> coding at a level far exceeding the comfort zone of my day job.

> That just won't do. Every developer needs an over engineered personal blog site. Why else
> would there be a meme for that.

> I was playing Dr Mario on a NES Classic with a friend (after beating him at Tetris of course),
> and a comment stood out to me regarding the unbalanced pill fall speed "can't you make them
> fall faster?". Yes. Yes I can.

> But since I'm running this at home and don't plan to scale it past a single instance, I opted
> for just keeping the data in memory 😱🤓!

> I trained this model for literally an entire weekend and boy am I glad I left it running that
> long!

What makes that sound like him:

* **First person, present opinions, hobbyist framing.** He is a working developer writing up a
  side project, not a vendor and not a tutorial site. "for fun", "(arguably) over-engineered",
  "as a learning exercise".
* **British English.** whilst, colour, behaviour, realised, learnt, favourite, maths, licence,
  aeroplane, mate, CBA. Both `-ise` and `-ize` endings appear across posts so do not fuss over
  those, but never Americanise the vocabulary.
* **Wildly varied sentence length.** Long explanatory sentences next to three word ones.
  "Python is so slow." "Yes. Yes I can." "Epic." "That just won't do."
* **Casual connectives**: Honestly, Actually, Anyway, By the way, Thing is, To be honest,
  I reckon, so may as well, cracked on, had a play with, had a go at.
* **`&` for `and`** in tight pairs: "cheap & dead easy", "black & white", "search & downloadable".
* **`e.g.` and `i.e.` constantly**, mid sentence, to expand a point rather than starting a new one.
* **Emphasis for tone of voice**, sparingly but genuinely: `**LOT**`, `**MASSIVE**`, `*way*`,
  `*yes*`, `**FINALLY**`, `**never silently swallow an error**`.
* **Emoji as a reaction at the end of a sentence**, never decorating a heading or a bullet:
  😱🤓, 🤢, 🤡, 😤, 😀, ⭐, 🤣, 😭. One or two per post is normal. Zero is also fine.
* **Parenthetical asides and trailing ellipses.** "(lol just don't look at the appendages)",
  "Maybe I will get lucky...", "all the Rust jobs on LinkedIn right now seem to be
  Blockchain/Web3 related..."
* **Named opinions with reasons.** He will say a thing is bad and say why, with a link:
  Tailwind 🤢, XML 🤢, Gatsby's dependency count, the Materialize maintainers, TOML 🤡.
  He does not hedge these into mush, but he also does not sneer at individuals without evidence.
* **Honest about failure.** "my attempts were unsuccessful", "this didn't work out and the model
  actually learned to do the total opposite", "I'm not sure just yet", "I don't know, I haven't
  seen anything on the internet that discusses this in depth". Keep this. Unresolved tension is
  the strongest human signal in the whole blog.
* **Instructional second person** in the how-to sections: "First make sure the `pi` user account
  is in the `gpio` user group", "Probably go and make a cup of tea."

Things to avoid in the voice: corporate register, marketing adjectives, motivational endings,
lecturing the reader about why a topic matters, and any sentence that could have appeared in a
vendor blog post.

## Punctuation

* **No em dashes or en dashes. Ever.** There is not a single one in thirteen posts and this is a
  hard rule, not a preference. Alex's dash is a **spaced hyphen** ` - ` and he uses it for the
  same job: *"Memory management is compile-time via the borrow checker - this is a MASSIVE
  learning curve"*. Use that, a comma, a colon, brackets, or a full stop and a new sentence.
  Scan the finished draft for `—` and `–` before handing it over. Any hit means it is not done.
* Straight quotes only, never curly. `"like this"`.
* British spacing and punctuation, no Oxford comma habit.

## Formatting

* Code blocks always carry a language tag, and usually a comment on the first line naming the
  file: `// posts/index.ts`, `# .github/workflows/main.yml`, `// next.config.mjs`.
* Shell blocks are `shell` or `bash` and are the real commands, in order, with the output shown
  when the output is the point.
* Blockquotes are used as **asides**, not as quotations. Four recurring jobs:
  * a TLDR: `> TLDR; the entire project was a bait & switch.`
  * a disclaimer or caveat about legality, cost or scope
  * a by-the-way: `> By the way, you can blame ChatGPT for the names, not me.`
  * a claim he is about to argue with: `> "It's a popular, open source package, if it fails then
    someone will just fork it."`
* Numbered lists for anything sequential (install steps, a game loop, an algorithm).
* Tables for reference data (registers, features, frontmatter fields, tetromino names).
* `<CheckList>` with `<CheckListItem>` and `<XListItem>` for a pros and cons list.
* `<PintoraDiagram>` for architecture, sequence and activity diagrams. `<BarChart>` and
  `<LineChart>` for real measured data, with the real data points inline.
* `<Latex>` for maths.
* Images are introduced by a short lead in line ending in a colon or full stop, then the image:
  *"Here's the themes that I ended up with:"*, *"Here's the guts of it."*

## Do not write like a language model

These patterns get a draft rejected. They are the tells that matter most for this blog.

1. **Em dashes.** Covered above. Non negotiable.
2. **"It's not just X, it's Y."** Also "Not only... but...", and clipped tailing negations
   bolted onto a sentence ("no guessing", "no wasted motion"). Write the actual claim as a
   normal clause.
3. **Rule of three.** Do not force ideas into groups of three to sound thorough. Two reasons, or
   five, whichever is true.
4. **Significance inflation.** stands as, serves as, is a testament to, marks a pivotal moment,
   underscores the importance of, reflects a broader shift, evolving landscape, setting the
   stage for. Alex writes what a thing is and what it did, not what it represents.
5. **Copula avoidance.** Use `is`, `are`, `has`. Not "serves as", "boasts", "features",
   "represents".
6. **AI vocabulary.** delve, crucial, pivotal, robust, seamless, leverage (as a verb, outside
   the 2017 posts), foster, intricate, tapestry, landscape (abstract), testament, underscore,
   showcase, garner, align with, vibrant, elevate, unlock, journey, realm.
7. **Superficial `-ing` tails.** "..., highlighting the flexibility of the approach",
   "..., ensuring maintainability". Cut them or make them a real sentence.
8. **Signposting.** "Let's dive in", "Let's explore", "Here's what you need to know",
   "In this post we will". Just do the thing. His posts start on the subject.
9. **Fake candour openers.** "Honestly?", "Look,", "Here's the thing", "The thing is" used as a
   theatrical pause before an ordinary point. Note that Alex genuinely does write "Honestly, I
   reckon..." and "To be honest" mid flow, which is fine. The banned version is the standalone
   one word hook followed by a reveal.
10. **Manufactured punchlines and staccato drama.** A run of short fragments engineered to land
    hard. One short sentence for emphasis is very much his style. Four in a row is not.
11. **Aphorism formulas.** "X is the Y of Z", "X is not a tool but a mirror", "the currency of",
    "the architecture of".
12. **Persuasive authority tropes.** "The real question is", "at its core", "fundamentally",
    "what really matters", "the deeper issue".
13. **Weasel attributions.** "Experts argue", "industry reports suggest", "many developers feel".
    Either link to the actual source or write it as his own opinion, which it usually is.
14. **Generic upbeat endings.** "Exciting times ahead", "a major step in the right direction",
    "the future looks bright". End on the last concrete fact, or on his actual call to the
    reader.
15. **False ranges.** "from X to Y" where X and Y are not on a real scale.
16. **Synonym cycling.** If it is a tetromino, call it a tetromino every time. Do not rotate
    through "the shape", "the piece", "the block" to avoid repetition.
17. **Excessive hedging.** "could potentially possibly". He hedges when he is genuinely unsure
    ("I think", "I'm not sure", "maybe") and states things flatly when he is not.
18. **Filler.** "in order to" for "to", "due to the fact that" for "because", "at this point in
    time" for "now", "it is important to note that", "has the ability to" for "can".
19. **Sycophancy and chat artifacts.** "Great question!", "I hope this helps", "Let me know if
    you'd like me to expand on any section", "Certainly!". None of this belongs in a post.
20. **Curly quotes, title case headings, and emoji on headings or bullet points.**
21. **Diff narration.** The post describes the project as it is, not as a changelog against a
    previous draft, unless the post is genuinely about what changed.

## Where Alex overrides the generic advice

Generic anti-AI-writing guidance would flag some things he actually does. Keep these:

* **Bold lead-ins on list items.** He uses them a lot and they should stay:
  `* **VPN:** Something to tunnel through the great firewall of London.` and
  `* **Pruning the tree of placements that were obviously bad.**` followed by the explanation.
  The rule to enforce is that the bold label carries real information, not that it disappears.
* **Emoji.** Allowed, at the end of sentences, as reactions. Never on headings or bullets.
* **Bold and italic for emphasis.** Allowed and characteristic. What is banned is mechanical
  bolding of key terms throughout a paragraph.
* **Short emphatic fragments.** Allowed. "Epic." "Python is so slow." "Yes. Yes I can."
* **Long sentences with several clauses.** Allowed, he writes plenty of them. The target is
  variety, not brevity everywhere.
* **Hyphenated compounds.** He is inconsistent about them ("compile-time", "cross platform",
  "well-defined"). Do not regularise this into a uniform house style.
* **His grammatical quirks in existing text.** When editing a published post, do not silently
  correct "it's" for "its", "would of", or similar. Fix them only if he asks. Never add errors
  deliberately either.

## Before you hand it over

Run this check on the draft:

* [ ] Zero `—` and zero `–` in the file.
* [ ] One sentence per line.
* [ ] Every factual claim, number, link and repo path came from Alex or from a source, not from
      you. Any gap is marked `TODO:` rather than filled with a guess.
* [ ] Frontmatter valid, filename `YYYY-MM-DD-<name>.mdx`, asset folder flagged if missing.
* [ ] It opens on the subject and closes on something concrete or a direct line to the reader.
* [ ] Read it aloud in your head. If a sentence sounds like a product page, a LinkedIn post or a
      tutorial site, rewrite it.
* [ ] Ask yourself plainly: what in this still reads as generated? Fix that, then answer again.

Then tell Alex what you were unsure about and what you left as `TODO:`.
