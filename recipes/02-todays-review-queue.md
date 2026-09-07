# 02. Today's review queue, in the chat

**Recorded 2026-09-07.** Raw JSON: [`../transcripts/2026-09-07-get-queue.json`](../transcripts/2026-09-07-get-queue.json)

Opening an app to find out whether you owe it anything is a small tax, and it is the reason most decks die. If you are already in a chat window, ask there.

## Prompt

```
What do I have due in MindDory today? Quiz me on a few of them.
```

## What came back

```json
{
  "ok": true,
  "data": {
    "lang": "en",
    "lang_defaulted": true,
    "due_now": [
      { "word": "convince you",       "source": "přesvědčit tě",     "next_review_at": "2026-04-15T09:13:17.247Z" },
      { "word": "volunteering",       "source": "dobrovolnictví",    "next_review_at": "2026-04-15T09:13:17.247Z" },
      { "word": "it was unfavorable", "source": "bylo to nepříznivé", "next_review_at": "2026-04-15T09:13:17.247Z" },
      { "word": "small scuffles",     "source": "menší potyčky",     "next_review_at": "2026-04-15T09:13:17.247Z" },
      { "word": "beneath",            "source": "pod",               "next_review_at": "2026-04-15T09:13:17.247Z" },
      { "word": "littering",          "source": "odpadování",        "next_review_at": "2026-04-15T09:13:17.247Z" },
      { "word": "draining",           "source": "vyčerpávající",     "next_review_at": "2026-04-15T09:13:17.247Z" },
      { "word": "he had admitted",    "source": "přiznal",           "next_review_at": "2026-04-15T09:13:17.247Z" }
    ],
    "due_soon": [
      { "word": "lack of rich farmers", "source": "nedostatek bohatých farmářů", "next_review_at": "2026-09-08T11:10:11.981Z" },
      { "word": "woefully",             "source": "žalostně",                    "next_review_at": "2026-09-08T11:11:18.342Z" }
    ]
  }
}
```

Two things about this output are not flattering, and both are the point of publishing it rather than a mock-up.

Those `next_review_at` values say April. This account owes the deck 293 cards and has owed some of them for five months. Nothing in the server hides that, softens it, or quietly re-dates the backlog; a card due in April is reported as due, full stop. If you want a tool that pretends you are on track, this is not it.

`lang_defaulted: true` means nobody said which language, so the server used the account's primary one. Pass `lang` when you are studying more than one and you get separate queues instead of a merged pile.

## What the assistant does with it

`due_now` and `due_soon` are separate lists so the assistant can quiz you on what is actually late and mention, without drilling you, what lands tomorrow. In practice it will work a handful into the conversation as questions rather than reading the list out. When you get one wrong, that is recipe 05 in reverse: `mark_struggled` brings the card back sooner.

## Variation

```
Give me the ten oldest cards I owe you, worst first,
and let's work through them in Spanish.
```

```
Do not quiz me, just tell me how far behind I am.
```
