# 06. What you keep running into

**Recorded 2026-09-07, twice.** Raw JSON: [`../transcripts/2026-09-07-get-active-vocab.json`](../transcripts/2026-09-07-get-active-vocab.json)

Your deck holds what you decided to learn. `get_active_vocab` holds what you keep bumping into, ranked by how often, which is a different and frequently better answer to "what should I study next".

This recipe exists in two halves because it was run before and after the capture in recipe 01. Same tool, same arguments, about a minute apart. It is the only test in this repo that shows the loop closing.

## Prompt

```
Based on what I have actually been running into lately, what should I work on?
```

## Before

```json
{ "lang": "en", "limit": 8, "lookback_days": 30 }
```

```json
{
  "ok": true,
  "data": {
    "words": [],
    "lookback_days": 30,
    "lang": "en",
    "note": "No tracked encounters in the window. Use capture_word to seed."
  }
}
```

Empty, and the server says why instead of returning a bare `[]`. This account owes 293 cards, some of them since April; what it did not have was a single logged encounter in the last thirty days, because until this session nothing had been captured through the connector. An empty result that explains itself is the difference between "you have nothing" and "nothing has been recorded yet", and those are not the same fact.

## After

Four `capture_word` calls later, unchanged arguments:

```json
{
  "ok": true,
  "data": {
    "words": [
      { "word": "attrition", "lang": "en", "uses": 1, "first_seen_at": "2026-09-07T15:39:41.828Z", "last_seen_at": "2026-09-07T15:39:41.828Z" },
      { "word": "brittle",   "lang": "en", "uses": 1, "first_seen_at": "2026-09-07T15:39:41.828Z", "last_seen_at": "2026-09-07T15:39:41.828Z" },
      { "word": "curtail",   "lang": "en", "uses": 1, "first_seen_at": "2026-09-07T15:39:41.828Z", "last_seen_at": "2026-09-07T15:39:41.828Z" },
      { "word": "windfall",  "lang": "en", "uses": 1, "first_seen_at": "2026-09-07T15:39:41.828Z", "last_seen_at": "2026-09-07T15:39:41.828Z" }
    ],
    "lookback_days": 30,
    "lang": "en",
    "note": "Top 4 words by encounter count over the last 30 day(s)."
  }
}
```

## What `uses` counts

Encounters, not cards. Every `capture_word` and every `log_interaction` adds one, so a word you looked up on Monday, met again in an article on Wednesday and used yourself on Friday sits at three, while a word you added once and never saw again stays at one. After a month of real use the ranking stops being alphabetical and starts being informative.

`uses: 1` across all four here is the honest reading of a session that captured each word exactly once. Nothing is being weighted or inferred; the count is the count.

## Cross-language by default

Omit `lang` entirely and this tool spans every language you study, which none of the deck tools do. That is deliberate: the question "what am I actually spending my attention on" does not respect language boundaries, especially if you are working on two at once. Pass `lang` when you want the frontier for one of them.

`lookback_days` runs from 1 to 365 and defaults to 30. Shorten it to see this week; stretch it to a year to find the word you have been circling since spring without ever sitting down with it.

## Useful pairing

```
Look at my active vocabulary and my due queue together.
Which words am I meeting often AND failing?
```

That crosses `get_active_vocab` against `get_queue`, and the overlap is the shortest list of words worth your evening.
