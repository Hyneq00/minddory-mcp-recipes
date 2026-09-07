# 04. A grammar mistake you just made

**Recorded 2026-09-07.** Raw JSON: [`../transcripts/2026-09-07-capture-grammar-mistake.json`](../transcripts/2026-09-07-capture-grammar-mistake.json)

Vocabulary is the easy half. The mistakes you repeat for years are structural, you make them fluently, and nobody corrects them because everyone understood you anyway.

## Prompt

Nothing to type. Set it up once at the top of the conversation:

```
Correct me when I get English grammar wrong, and log the pattern.
Do not stop the conversation to do it.
```

Then you write something like `I am living in Prague since 2019` and the assistant fixes it in passing while logging this.

## Request

```json
{
  "user_text": "I am living in Prague since 2019.",
  "correction": "I have been living in Prague since 2019.",
  "error_type": "tense",
  "explanation": "A state that started in the past and still holds takes the present perfect continuous with \"since\", not the present continuous.",
  "lang": "en-us"
}
```

## What came back

```json
{
  "ok": true,
  "data": {
    "answer_id": 12265,
    "logged_at": "2026-09-07T15:39:56.394Z",
    "error_type": "tense",
    "note": "Mistake logged silently. Feeds future grammar-layer surfacing."
  }
}
```

## No flashcard, and that is on purpose

Notice what the response does not contain: a `flashcard_id`. Grammar is not card-shaped. Drilling `have been living` as a two-sided card teaches you to answer that card, which is a skill of no use to anyone. The row goes into the answer log tagged `grammar_mistake`, carrying the sentence, the fix and the reason in its metadata, and it shows up at [app.minddory.com/grammar](https://app.minddory.com/grammar) straight away: the newest corrections in a list, and above them a tally of your error types sorted by how often you make each one. The single row is not the useful part. A tense column three times taller than everything else, four months in, is the useful part.

`error_type` is bucketed into one of eleven values: tense, agreement, word_choice, word_order, article, preposition, spelling, pluralization, conjugation, gender, other. Send something outside that set and the server files it as `other` rather than rejecting the call, so an over-creative model cannot lose your mistake.

## The regional-variant trap

`lang` here is `en-us`, not `en`, and the tool description spends a paragraph on why. American past simple with *already*, British present perfect, *in hospital* against *in the hospital*, Brazilian gerund against European Portuguese *a + infinitive*: these are variants, not errors, and a logger that files them as mistakes trains you out of your own dialect. When the account carries a full variant tag the model is told to check the correction against it first. When only a base code is set, every regional form counts as valid and borderline calls get skipped.

The correction above survives that check, incidentally. `I am living here since 2019` is wrong on both sides of the Atlantic.
