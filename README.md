# Welcome to your Bilt project

[![Built with Bilt](https://img.shields.io/endpoint?url=https%3A%2F%2Fapp.bilt.me%2Fapi%2Fbadge)](https://bilt.me)

## DermaScan live integration

This Expo app is the replacement presentation layer for the existing DermaScan FastAPI/PostgreSQL backend. It preserves the peach-and-ink-blue design. There are no demo catalog or scoring fallbacks.

The public API origin defaults to `https://dermascan-iorj.onrender.com`; set `EXPO_PUBLIC_API_URL` to a different **origin**, without `/api/v1`, when needed. No privileged API keys belong in this variable. Native sessions use SecureStore; browser sessions are memory-only. Refresh is serialized and private queries are isolated by account. Session recording is disabled because profiles contain health information.

### Implemented routes

- `/`: paginated top-rated/recent shelves, product-name/brand search, categories, concern-band and ingredient inclusion/exclusion filters.
- `/categories`, `/product/[id]`, `/scan`: category tree, real ingredient/score details, barcode camera/manual lookup.
- `/account`, `/profile`, `/avoidance`: registration, sign-in, refresh, device sign-out, skin profile and avoided products. Allergies/ingredient avoidance are managed from product ingredient explanations using canonical IDs.
- `/routines`, `/routine/add`, `/recommendations`: ordered steps, notes, completion toggles, server conflict checks, profile skin-type recommendations and explicit replacement confirmation.
- `/analysis`, `/contribute`: text/OCR label analysis and asynchronous product submission, without claiming a submission is already cataloged.

Missing, non-HTTPS, localhost and failed product images show `Photo unavailable`. Product score zero is valid; null means insufficient data. Unknown ingredients are not considered safe. Estimated-score badges use the detail response; home badges do not claim final scores because the deployed home API has an estimated-flag defect.

### Backend handoff — not deployed from this workspace

The linked backend source was corrected in these files, with no schema migration or database writes:

- `src/app/modules/catalog/home_repository.py` and `home_service.py`: preserve `score_is_estimated` in home cards.
- `src/app/modules/catalog/search_router.py` and `search_service.py`: forward the requested locale.
- `src/app/api/v1/contributions.py`: bounded uploads, actual-image validation, true image extension/MIME and documented errors.
- Two unit regression files under `tests/unit/`.

Portable copies are included here so the fixes are not lost when only the app repository is exported. Start from the **current linked backend revision**, including its existing suitability implementation. From this app checkout:

```sh
python utils/apply_backend_fixes.py /path/to/dermascan/backend
# Review the dry run, then:
python utils/apply_backend_fixes.py /path/to/dermascan/backend --apply
cd /path/to/dermascan/backend
uv run ruff check --fix src/app/modules/catalog/home_repository.py src/app/modules/catalog/home_service.py src/app/modules/catalog/search_router.py src/app/modules/catalog/search_service.py src/app/api/v1/contributions.py tests/unit/test_mobile_catalog_contract.py tests/unit/test_contribution_upload_contract.py
uv run ruff format src/app/modules/catalog/home_repository.py src/app/modules/catalog/home_service.py src/app/modules/catalog/search_router.py src/app/modules/catalog/search_service.py src/app/api/v1/contributions.py tests/unit/test_mobile_catalog_contract.py tests/unit/test_contribution_upload_contract.py
uv run pytest tests/unit/test_mobile_catalog_contract.py tests/unit/test_contribution_upload_contract.py
uv run pytest
uv run python scripts/export_openapi.py
```

The patcher is dry-run by default, validates exact source context and Python syntax before writing, and does not contact storage, the database or Render. These Python checks were **not run in this workspace**. Run the backend CI suite and review the regenerated contract, then commit/deploy the backend revision through its normal deployment process.

### Verified deployment gaps (2026-11-16)

- Public home, product details, search and home shelf pagination respond successfully; public catalog/details render in the web preview.
- The deployed OpenAPI lacks `/api/v1/products/{product_id}/suitability`, and the known-product URL returns generic HTTP 404. The linked source includes the route and service. Deploy the correct full backend revision before accepting compatibility.
- Deployed search summaries omit `score_is_estimated`; local source includes it. Home incorrectly returns false for a product whose detail returns true.
- Some non-null photos use `http://localhost:9000/...`; repair the public `IMAGE_CDN_BASE_URL` in the backend deployment before generating further photo URLs. Existing stored URLs need separate repair.
- Private flows, OCR provider availability, contribution processing and native camera/uploads still require signed-in/device acceptance tests. No chat credentials were embedded or used for testing.
- UI is currently English; full French/Arabic interface localization and RTL remain a release follow-up.
- Backend account deletion/password-reset/token-revocation APIs are absent; do not advertise them. Device sign-out clears local credentials, not server tokens.
- Expo Doctor currently reports 19/20 checks passed and three patch-version warnings (Expo, dev client, SecureStore); SecureStore is intentionally on the carried preview patch. Dependency tree resolves cleanly.

### Acceptance before removing the old frontend

1. Rotate the credentials shared in chat. Use the app sign-in form with a test account; never add passwords/tokens to source, screenshots or analytics.
2. Catalog: browse both shelves, load further pages, search accent-insensitive product names, combine categories/ingredients/bands, clear empty results and retry network failures. Category/ingredient filtering deliberately lists scored products only.
3. Detail: verify zero versus null, estimated flags, unmatched ingredients and missing/broken photos. Barcode: test known, valid unknown and malformed codes, permission refusal and repeated camera scans.
4. Sessions: sign in/register, restart native app, renew an expired access token, reject an expired refresh token, sign out and switch accounts without replaying another account's requests.
5. Profile: save health fields without losing allergies added on product pages; add/remove allergy and ingredient/product avoidance; refresh suitability after changes. Never treat an unset profile as compatible.
6. Routines: add with explicit step type, reject duplicates, review conflicts before confirming, reorder, save notes, remove, toggle completion once, and explicitly confirm recommendation replacement. Recommendations use skin type, not full allergy/health screening.
7. Labels/submissions: try readable/unreadable photos, unsupported type, >10 MB, OCR failure, text correction and asynchronous submission receipt. Confirm worker results separately; there is no contribution-status endpoint.
8. Test narrow screens, keyboard access, screen readers, iOS/Android back gestures, camera permissions and real photo uploads on devices.

The old linked frontend remains untouched as an acceptance/rollback reference. No destructive cutover or database/image backfill was performed. For photos, first inventory existing storage keys and repair matching URLs in a dry-run batch; enqueue only truly missing assets afterward rather than rerunning the whole enrichment pipeline.

## Project info

**Project URL**: https://app.bilt.me/agent/6e6e6bf5-e046-411a-8683-f880812e38a7

**Project ID**: `6e6e6bf5-e046-411a-8683-f880812e38a7`

## How can I edit this app?

There are several ways of editing your application.

**Use Bilt**

Simply visit your [Bilt Project](https://app.bilt.me/agent/6e6e6bf5-e046-411a-8683-f880812e38a7) and start sending messages. Describe what you want to change, add, or fix in natural language.

Changes made via Bilt are instant - just send a message and your app updates.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can export the source code from Bilt and make changes directly.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Export and clone your Bilt project.
# (Download source from Bilt or connect to your git repo)
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm install

# Step 4: Start the Expo development server.
npx expo start
```

Scan the QR code with Expo Go on your phone to see your app running locally.

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- React Native
- Expo
- TypeScript
- AsyncStorage (local data persistence)
- Expo Router (navigation)

All generated automatically by Bilt from your natural language instructions.

## How can I test this project?

**Option 1: Preview in Bilt (Recommended)**

Open your [Bilt Project](https://app.bilt.me/agent/6e6e6bf5-e046-411a-8683-f880812e38a7) and use the built-in preview.

Open **Deploy & Share** to create a revocable preview link or build the app on your iPhone.

**Option 2: Run Locally**

```sh
npm install
npx expo start
```

Then scan the QR code with Expo Go.

## How can I deploy this project?

Open your [Bilt Project](https://app.bilt.me/agent/6e6e6bf5-e046-411a-8683-f880812e38a7), select **Deploy & Share**, then choose **Publish to web**, **Release on App Store**, or **Release on Play Store**.

### Deploy with Bilt

Publishing to web creates a public, installable web app at its own URL. Bilt also guides you through preparing native releases for the App Store and Play Store.

## How can I make changes to my app?

**Via Bilt (Easiest)**

Visit your [Bilt Project](https://app.bilt.me/agent/6e6e6bf5-e046-411a-8683-f880812e38a7) and send a message describing what you want:

- "Add a dark mode toggle"
- "Change the button color to blue"
- "Add a new screen for user settings"
- "Fix the navigation bar spacing"

Bilt understands natural language and updates your app automatically.

**Via Code**

Export the source, make changes in your IDE, and test locally with `npx expo start`.

## Can I use this with the MCP protocol?

Yes! Bilt is available as a remote MCP server at `https://mcp.bilt.me/mcp`.

Connect any MCP-compatible AI agent (Claude Desktop, OpenClaw, etc.) to programmatically build and modify mobile apps.

**Example MCP integration:**

```json
{
  "mcpServers": {
    "bilt": {
      "transport": {
        "type": "sse",
        "url": "https://mcp.bilt.me/mcp/sse",
        "headers": {
          "Authorization": "Bearer YOUR_API_KEY"
        }
      }
    }
  }
}
```

Read more:

- [Bilt MCP Documentation](https://bilt.me/docs)
- [MCP Registry](https://registry.modelcontextprotocol.io/v0.1/servers/io.github.buildingapplications%2Fmcp/versions/latest)

## Need help?

- 📚 [Bilt Documentation](https://bilt.me/docs)
- 💬 [Discord Community](https://discord.gg/3FqNgmSYdZ)
- 🐦 [Twitter Updates](https://twitter.com/biltmeanapp)
- 📧 Email: support@bilt.me

---

<div align="center">

**Built by AI. No code required.** ✨

[Try Bilt](https://bilt.me) • [View Docs](https://bilt.me/docs) • [Docs MCP Server](https://bilt.me/docs/mcp)

</div>
