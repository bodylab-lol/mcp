# Body Lab MCP server

Connect Claude, ChatGPT, or any assistant that speaks the
[Model Context Protocol](https://modelcontextprotocol.io) to your
[Body Lab](https://bodylab.lol) training. Ask what to do today and why, how
last week went, whether you're recovered, or what your squat has been doing,
and the answers come from your own data and Body Lab's engine.

```
https://bodylab.lol/mcp
```

This repository is the public home of the server: how to connect, the tool
reference, the MCP Registry entry, and a Claude Code plugin. The server itself
runs at the address above. It's hosted, so there's nothing to install or
run.

## Connect

You need a Body Lab account. The first time an assistant connects, it sends
you to Body Lab to sign in and approve it.

Body Lab isn't listed in assistants' app directories yet, so you add it by
its address.

**Claude (web, desktop, mobile):**

1. On claude.ai or in Claude Desktop, open **Customize → Connectors**.
2. Press **+**, choose **Add custom connector**, paste `https://bodylab.lol/mcp`
   and press **Add**.
3. Press **Connect**, then sign in to Body Lab and allow Claude.
4. In a chat, turn Body Lab on from **+ → Connectors**. It's then available in
   the Claude mobile app too.

On a Team or Enterprise plan, an organization owner adds it first
(**Organization settings → Connectors**). The free plan allows one custom
connector. See Anthropic's
[custom connector guide](https://support.claude.com/en/articles/11175166-get-started-with-custom-connectors-using-remote-mcp).

**ChatGPT** (web; Plus, Pro, Business, Enterprise or Education):

1. Open **Settings → Security and login** and turn on **Developer mode**.
2. Open **Plugins**, press **+**, and create an app with
   `https://bodylab.lol/mcp`, using OAuth.
3. Sign in to Body Lab and allow ChatGPT.
4. In a chat, choose Body Lab from **Developer mode** in the message box.

See OpenAI's [developer mode guide](https://developers.openai.com/api/docs/guides/developer-mode).

**Claude Code:**

```sh
claude mcp add --transport http body-lab https://bodylab.lol/mcp
```

Then run `/mcp` inside Claude Code and choose Body Lab to sign in. Or install
the plugin, which adds the server and skills for using it well:

```sh
/plugin marketplace add bodylab-lol/mcp
/plugin install body-lab@bodylab-lol
```

**VS Code, Cursor and other clients:** add a remote (Streamable HTTP) MCP
server with the URL `https://bodylab.lol/mcp`. For clients configured with
JSON:

```json
{
  "mcpServers": {
    "body-lab": { "type": "http", "url": "https://bodylab.lol/mcp" }
  }
}
```

## What it can do

An assistant can see your training. With your permission it can also see
your lab results and add new ones, for example from a PDF or photo of a lab
report, and do the same with body composition scans such as DEXA. It can't
change or delete anything.

| Tool | For |
| --- | --- |
| `get_today` | Today's (and tomorrow's) prescribed session, the reasons behind it, alternatives, readiness |
| `get_week` | The next seven days as the engine projects them: detailed through tomorrow, summarised after, and shifting each morning |
| `get_weekly_review` | How a complete week went against what was prescribed, load against the band, the strength floor, and whether training so far supports an upcoming event |
| `get_training_status` | Fitness, fatigue, form, workload ratio, strain, intensity balance, week by week |
| `list_activities`, `get_activity` | Your activities, and one in detail with load, zones, power bests and plan adherence |
| `get_recovery` | Morning resting HR, HRV, sleep and energy scores |
| `get_strength` | The strength session Body Lab would prescribe now, estimated maxes, recent sessions |
| `get_profile` | Heart-rate anchors, FTP, strength equipment, test results, power curve |
| `find_exercises` | The strength exercise catalogue |
| `suggest_routes` | Routes you've done before that fit today's session |
| `get_lab_results` | Your blood test results: each marker over time against the lab's range and guideline limits, and whether a change is beyond normal variation. Needs `labs:read` |
| `record_lab_results` | Adds a blood draw and its results as the report prints them, after the assistant checks the values with you. It can't edit or delete results. Needs `labs:write` |
| `get_body_composition` | Your body composition scans: total and regional fat, lean and bone mass, body fat percent, visceral fat, and whole-body bone density, as your report gave them. Needs `body:read` |
| `record_body_composition` | Adds one scan as the report prints it, after the assistant reads every value back to you. It can't edit or delete scans. Needs `body:write` |

Prompts: **What should I do today?** (`todays-session`) and **Review my week**
(`weekly-review`).

Full reference, with every argument: [TOOLS.md](TOOLS.md). Machine-readable,
with input and output schemas: [tools.json](tools.json).

## Your data and permissions

Every connection can see your training (`training:read`). Lab results and
body composition scans are separate from it and from each other, and each is
off unless you turn it on when you approve an assistant:

| Scope | Lets the assistant |
| --- | --- |
| `training:read` | See your training, recovery, activities and profile |
| `labs:read` | See your lab results |
| `labs:write` | Add lab results you give it. It can't change or delete them |
| `body:read` | See your body composition scans |
| `body:write` | Add body composition scans you give it. It can't change or delete them |

An assistant you connected before these existed doesn't get them
automatically, and one you allowed for lab results doesn't get body
composition. To allow either, connect it again (in Claude, disconnect and
reconnect Body Lab) and tick those boxes when Body Lab asks. To correct or
delete a lab result, or to remove a scan, use Body Lab on the web.

Body composition scans, including bone density, are measurements you
recorded. Body Lab shows them back to you and nothing more: they are not a
diagnosis, a whole-body scan is not a diagnostic bone density test, and
nothing Body Lab prescribes reads them.

- When you approve an assistant, Body Lab shows who published it (or that it's
  unverified), where it will send you back to, and what it can do.
- What an assistant reads goes to that assistant's provider, and they handle it
  under their own terms.
- See and disconnect assistants any time in Body Lab under **Settings → AI
  assistants**. Disconnecting works immediately.
- Body Lab's recommendations are training guidance, not medical advice.
- Full details: [Privacy Policy](https://bodylab.lol/privacy) and
  [Terms of Service](https://bodylab.lol/terms).

## For client developers

The server follows the MCP authorization spec (2026-07-28):

- **Protected resource metadata:** `https://bodylab.lol/.well-known/oauth-protected-resource/mcp`
- **Authorization server metadata:** `https://bodylab.lol/.well-known/oauth-authorization-server`
- **Client registration:** Client ID Metadata Documents (preferred), or dynamic
  client registration at `/oauth/register`.
- **Flow:** authorization code with PKCE (S256 only). Include the `resource`
  parameter (`https://bodylab.lol/mcp`). Authorization responses carry `iss`.
- **Clients:** public only (`token_endpoint_auth_method: none`). Refresh
  tokens rotate. Revoke at `/oauth/revoke`.
- **Scopes:** `training:read` (every connection), plus the optional
  `labs:read`, `labs:write`, `body:read` and `body:write`. A 401 names all
  five; the athlete chooses the
  optional ones on the consent page, and the token response's `scope` says
  what was granted. `tools/list` shows only the tools the grant covers. A
  `tools/call` for a tool it doesn't cover gets `403` with
  `WWW-Authenticate: Bearer error="insufficient_scope"` and a `scope` naming
  the grant's scopes plus the one needed, for step-up authorization.
- **Transport:** Streamable HTTP, stateless, on protocol 2026-07-28 and the 2025
  `initialize` handshake.

Registry name: `lol.bodylab/body-lab`.

## Issues

Bugs, questions and tool requests: [open an issue](https://github.com/bodylab-lol/mcp/issues).
