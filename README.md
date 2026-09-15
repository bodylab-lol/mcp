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

Read-only for now. An assistant can see your training but can't change or
delete anything.

| Tool | For |
| --- | --- |
| `get_today` | Today's (and tomorrow's) prescribed session, the reasons behind it, alternatives, readiness |
| `get_training_status` | Fitness, fatigue, form, workload ratio, strain, intensity balance, week by week |
| `list_activities`, `get_activity` | Your activities, and one in detail with load, zones, power bests and plan adherence |
| `get_recovery` | Morning resting HR, HRV, sleep and energy scores |
| `get_strength` | The strength session Body Lab would prescribe now, estimated maxes, recent sessions |
| `get_profile` | Heart-rate anchors, FTP, strength equipment, test results, power curve |
| `find_exercises` | The strength exercise catalogue |
| `suggest_routes` | Routes you've done before that fit today's session |

Prompts: **What should I do today?** (`todays-session`) and **Review my week**
(`weekly-review`).

Full reference, with every argument: [TOOLS.md](TOOLS.md). Machine-readable,
with input and output schemas: [tools.json](tools.json).

## Your data and permissions

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
- **Scope:** `training:read`.
- **Transport:** Streamable HTTP, stateless, on protocol 2026-07-28 and the 2025
  `initialize` handshake.

Registry name: `lol.bodylab/body-lab`.

## Issues

Bugs, questions and tool requests: [open an issue](https://github.com/bodylab-lol/mcp/issues).
