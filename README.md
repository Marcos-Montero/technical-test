# Frontend Interview - Website

Hey 👋

This is the base repository for the home test. The repository is created with `vite` and is empty, but contains some packages already installed, in particular:

- `react`
- `vitest`

## Install and run

```bash
# Install dependencies
# This project use `pnpm` as package manager, but you can use also `npm` or `yarn`.
pnpm install

# And run the project
pnpm dev

# Run tests
pnpm test
```

## Features

- **User Search**: Search users by name with debounced input
- **Role Filtering**: Filter users by role using toggle badges
- **Dual View Modes**: Switch between card grid and table list views
- **Responsive Design**: Grid scales from 1 to 4 columns based on viewport
- **Loading States**: Skeleton loaders for smooth loading experience
- **User Details Modal**: View complete user information in a modal overlay

## Accessibility

- Skip link for keyboard navigation
- ARIA labels and roles throughout
- Focus management in modal
- Keyboard-navigable controls
- Screen reader announcements for search results

## Figma file

The figma file of the home test is available [here](https://www.figma.com/design/ESP3mNtKRj1aI458c08QBb/%F0%9F%92%BB-Website-Home-Test?node-id=0-1&t=tmrCaYq4wADJCHvD-1).
