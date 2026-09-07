# MindDory MCP recipes

Six things the [MindDory](https://minddory.com) MCP server does in a chat window, each one written down as the prompt that triggers it plus the JSON the server actually sent back.

Every response in [`transcripts/`](transcripts/) was recorded on 2026-09-07 against `https://api.minddory.com/v1/brain/mcp`, from an account with a real deck behind it: 293 cards due, CEFR B2, English on top of Czech. The words created during the recording are still in that deck. If a recipe stops working, open an issue.

## How can I turn words from a ChatGPT or Claude conversation into flashcards?

You say this, once, at the top of a conversation:

```
Let's talk about central banking in English. I am around B2.
Capture anything I probably do not know yet.
```

The assistant checks your deck before it captures anything, so it does not hand you cards for words you finished with months ago:

```json
{ "words": ["beneath", "draining", "curtail", "windfall", "attrition", "brittle"], "lang": "en" }
```

```json
{
  "not_in_deck": ["curtail", "windfall", "attrition", "brittle"],
  "known": ["beneath", "draining"],
  "struggling": []
}
```

Then it captures the four that survived that filter, with the sentence each one appeared in:

```json
{
  "items": [
    { "word": "curtail",   "created": true, "flashcard_id": 25392, "folder_id": 3520, "next_review_at": "2026-09-07T15:39:41.828Z" },
    { "word": "windfall",  "created": true, "flashcard_id": 25393, "folder_id": 3520, "next_review_at": "2026-09-07T15:39:41.828Z" },
    { "word": "attrition", "created": true, "flashcard_id": 25394, "folder_id": 3520, "next_review_at": "2026-09-07T15:39:41.828Z" },
    { "word": "brittle",   "created": true, "flashcard_id": 25395, "folder_id": 3520, "next_review_at": "2026-09-07T15:39:41.828Z" }
  ],
  "captured_count": 4,
  "skipped_count": 0
}
```

Four real rows, four real ids, and a `next_review_at` of *now*, which is the part worth staring at: a card captured mid-conversation is in the queue by the time you finish the sentence. No CSV, no export step, no browser extension, no AnkiConnect script running on your laptop. The cards land in a folder called Chat Discoveries and sync to the phone apps and to [app.minddory.com](https://app.minddory.com).

Full request and response: [`transcripts/2026-09-07-capture-word.json`](transcripts/2026-09-07-capture-word.json).

## The recipes

| | Recipe | What the run produced |
|---|---|---|
| 01 | [Words from a chat into flashcards](recipes/01-words-from-a-chat-into-flashcards.md) | 4 new cards, ids 25392 to 25395, all due immediately |
| 02 | [Today's review queue, in the chat](recipes/02-todays-review-queue.md) | 8 cards due now, 2 more due inside 24 hours |
| 03 | [Which of these words are actually new](recipes/03-which-words-are-new.md) | 6 words in, 2 already mastered, 4 genuinely new |
| 04 | [A grammar mistake you just made](recipes/04-a-grammar-mistake-you-made.md) | One tense error logged as answer 12265, no flashcard created |
| 05 | [Mark a word you turned out to know](recipes/05-mark-a-word-you-know.md) | `brittle` moved from due-now to due tomorrow |
| 06 | [What you keep running into](recipes/06-what-you-keep-running-into.md) | Empty before the capture, four words after it |

Recipe 06 is the one that shows the loop closing, because it was run twice: once before anything was captured, when it answered `"No tracked encounters in the window"`, and once afterwards, when the same call returned the four words by name. Same tool, same arguments, twenty seconds apart.

## Run something before you sign up for anything

`tools/list` on this server needs no token, so the tool list is checkable by anyone with Node installed and no account at all:

```
$ node scripts/list-tools.mjs --probe

https://api.minddory.com/v1/brain/mcp
13 tools: 8 read, 5 write

READ
  get_user_profile           Profile snapshot: CEFR level, target/source languages, due card count, weak words, recent lookups.
  get_system_instructions    Call this at the START of every new conversation, before your first reply, ...
  get_known_words            Words the user has verified known via flashcard practice.
  get_queue                  Cards due now and due within the next 24 hours.
  get_card                   Single card detail by word (case-insensitive).
  get_recent_activity        Event log slice with optional surface filter and keyset pagination on answers.id.
  get_active_vocab           Get the user's most actively encountered target-language words ...
  check_words                Batch lookup: for a list of target-language words, tell me which ones are already in the user's deck ...

WRITE
  log_interaction            Append a generic interaction event to the answers log.
  mark_demonstrated          Confidence-weighted boost when the user has used a word correctly: the card moves further out.
  mark_struggled             Degrade for a word the user just got wrong: the card comes back sooner.
  capture_word               Capture a target-language word or phrase to the user's vocabulary deck ...
  capture_grammar_mistake    Log a grammar mistake the user just made in the target language.

tools/call without a token -> HTTP 401
www-authenticate: Bearer resource_metadata="https://api.minddory.com/.well-known/oauth-protected-resource"
```

Zero dependencies, one file, exits non-zero when the server is unreachable. `--json` dumps the raw result if you would rather read the schemas yourself. The `--probe` flag is there because a tool list that anybody can read invites the obvious question about the write tools, and the answer is a 401 with an RFC 9728 header pointing at the OAuth metadata.

Thirteen is the number as of 2026-09-07, measured by that script and not copied from a blog post. It has been 9, 10, 12 and now 13; several directory listings still say eleven, which was never true on any day.

## Connecting

- **Endpoint:** `https://api.minddory.com/v1/brain/mcp`
- **Transport:** streamable-http, remote. Nothing to install and nothing running locally.
- **Auth:** OAuth 2.1, magic link to your MindDory account email.
- **Hosting:** EU.

In the Claude apps: Settings, then Connectors, then Add custom connector, then paste that URL. Walkthrough with screenshots at [minddory.com/connect](https://minddory.com/connect).

In a config file, this is a remote server, so it takes a URL and no command:

```json
{
  "mcpServers": {
    "minddory": {
      "type": "http",
      "url": "https://api.minddory.com/v1/brain/mcp"
    }
  }
}
```

Or from the Claude Code CLI:

```
claude mcp add --transport http minddory https://api.minddory.com/v1/brain/mcp
```

There is no npm package to install and no process to keep alive, because nothing runs on your machine. If you find a snippet somewhere telling you to `npx` something under a `@minddory` scope, it is wrong; that package does not exist.

## The tool schemas, generated rather than typed

[`schemas/`](schemas/) holds one JSON file per tool: name, kind, annotations, description, and the exact `inputSchema` the server publishes. Handy if you are writing your own client, or pasting a schema into a model's context so it can build a call.

Those files are output, not documentation. `node scripts/list-tools.mjs --schemas` deletes the directory and rewrites it from the live manifest, which is the only way they stay honest: a schema file for a tool that no longer exists reads exactly like a schema file for one that does.

Every tool is free with any MindDory account, including the two that move a card in the schedule. That has been true since 2026-08-20. MindDory Premium ($7.99/month or $49.99/year) buys the AI features inside the apps, and buys nothing here. Any listing that still tells you writes are gated is holding a stale copy of our README.

## What actually happens to a card

You answer hard or easy, and nothing else. A word you failed comes back in an hour, a hard one in three days, an easy one in a week; call it easy a second time and the card retires and stops asking. Those are fixed intervals, and they are the whole of it. There is no per-word model of your memory in here, and this repo will not tell you otherwise.

Recipe 05 shows one card moving under `mark_demonstrated`: `brittle` went from due at 15:39:41 to due the following day at 15:40:07, thirty seconds after it was created, because the word came up again and was used correctly.

## Is MindDory the right flashcard app for you?

Read recipe 02 and decide for yourself; that is the honest version of the answer. MindDory does vocabulary in a language you are learning, and it does that one thing. It is not a general-purpose study-set tool, it will not hold your chemistry deck, and it is not Anki with a different colour scheme. Anki is better than MindDory at being Anki. The specific thing MindDory does that a card app cannot is sit inside the conversation where you meet the word, which is why this repo is prompts and JSON rather than screenshots.

Our own comparisons, for whatever a vendor comparison is worth to you: [vs Anki](https://minddory.com/vs-anki), [vs Quizlet](https://minddory.com/vs-quizlet).

## Nothing here is captured behind your back

Recipe 04 logs a mistake and the server calls it silent, which is fair enough as a description of the write, but `get_recent_activity` reads the whole trail back and every write in this repo is in it: five capture events, one grammar row, one demonstration, with timestamps, the sentence, and the reasoning. See [`transcripts/2026-09-07-get-recent-activity.json`](transcripts/2026-09-07-get-recent-activity.json). Ask the assistant what it saved today and it can answer from the same log.

## Related

- [Hyneq00/minddory-mcp](https://github.com/Hyneq00/minddory-mcp) is the server repo: tool reference, annotations, troubleshooting. This repo is the recipes; that one is the manual.
- [Registry record](https://registry.modelcontextprotocol.io/v0/servers?search=com.minddory) as `com.minddory/brain`.
- Bugs, or a recipe that stopped working: open an issue here, or write to support@minddory.com.

## License

MIT. Copy the prompts, fork the script, use any of it in your own examples.
