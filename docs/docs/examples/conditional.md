# Conditional Rendering

Demonstrates using `if` blocks to conditionally show/hide elements.

## Source Code

```hjx
component UserProfile

state:
  username = "Alice"
  isLoggedIn = true
  isPremium = false
  followerCount = 150

layout:
  view.profile:
    text.greeting: "Welcome {{username}}"

    if (isLoggedIn):
      view.logged-in:
        text: "You are logged in"
        text.follower-count: "Followers: {{followerCount}}"
        button.logout (on click -> logout): "Logout"

    if (!isLoggedIn):
      view.logged-out:
        text: "Please log in to continue"
        button.login (on click -> login): "Login"

    if (isPremium):
      view.premium-badge:
        text.badge: "⭐ Premium Member"

    if (!isPremium):
      view.upgrade-prompt:
        text: "Want premium features?"
        button.upgrade (on click -> upgradePremium): "Upgrade Now"

style:
  .profile { padding: 24px; max-width: 400px; margin: 0 auto; font-family: system-ui, -apple-system, sans-serif; background: #f5f5f5; border-radius: 12px; }
  .greeting { font-size: 28px; font-weight: bold; margin-bottom: 20px; }
  .logged-in { padding: 16px; background: white; border-radius: 8px; margin-bottom: 16px; }
  .logged-out { padding: 16px; background: #ffe6e6; border-radius: 8px; margin-bottom: 16px; }
  .follower-count { font-size: 16px; margin: 12px 0; color: #666; }
  .logout, .login, .upgrade { padding: 10px 16px; border-radius: 6px; border: none; cursor: pointer; margin-top: 12px; }
  .logout { background: #ff6b6b; color: white; }
  .login { background: #007bff; color: white; }
  .upgrade { background: #ffc107; color: black; }
  .premium-badge { padding: 16px; background: #fff3cd; border-radius: 8px; margin-bottom: 16px; border: 2px solid #ffc107; }
  .badge { font-size: 18px; font-weight: bold; color: #cc8800; }
  .upgrade-prompt { padding: 16px; background: #e7f3ff; border-radius: 8px; }

handlers:
  logout:
    log "Logged out"
    set isLoggedIn = false
  login:
    log "Logged in"
    set isLoggedIn = true
  upgradePremium:
    log "Upgraded to premium"
    set isPremium = true
```

## Key Concepts

- **Conditional blocks**: `if (condition):` shows content when true
- **Negation**: `!isLoggedIn` checks if NOT logged in
- **State changes**: Handlers toggle boolean values

## How It Works

1. The `if` block checks the condition
2. If true, the content is rendered
3. If false, the content is hidden (display: none)
4. When state changes, conditions are re-evaluated
5. UI updates to show/hide appropriate content

## Running

```bash
node dist/cli.js dev examples/conditional.hjx --out dist-app --port 5172
```

Try clicking:
- "Logout" - shows login prompt
- "Login" - shows dashboard
- "Upgrade Now" - shows premium badge
