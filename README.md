# MicroQuest - Refactored Component Structure

This document outlines the refactored component structure of the MicroQuest app, focusing on reusable components, hooks, and improved organization.

## UI Components

### `/src/components/ui/`

This directory contains reusable UI components that can be used throughout the application:

- **Button.tsx**: Reusable button component with multiple variants (primary, secondary, gradient, icon), sizes, and loading state
- **Card.tsx**: Generic card component with support for interactive state and disabled styling
- **Modal.tsx**: Reusable modal dialog with customizable header, content, and footer
- **ProgressBar.tsx**: Generic progress bar component used for XP bars and other progress indicators

## Custom Hooks

### `/src/hooks/`

This directory contains custom hooks that encapsulate reusable logic:

- **useTasks.ts**: Handles task filtering, completion, and availability logic
- **useHarvest.ts**: Manages harvest modal state and reward claiming logic
- **useStatIcon.tsx**: Provides stat icon rendering logic for different stat types (strength, vitality, focus)

## Refactored Components

The following components have been refactored to use the new UI components and hooks:

- **TaskCard.tsx**: Uses Card, Button, useTasks, and useStatIcon
- **HarvestModal.tsx**: Uses Modal, Button, and useHarvest
- **XpBar.tsx**: Uses ProgressBar
- **AddCreditsButton.tsx**: Uses Button

## Benefits of the Refactoring

1. **Improved Reusability**: Common UI patterns are now extracted into reusable components
2. **Separation of Concerns**: Business logic is separated from presentation through custom hooks
3. **Reduced Duplication**: Common styling and behavior patterns are defined in a single place
4. **Better Maintainability**: Changes to UI patterns can be made in a single location
5. **Simplified Components**: Feature components are now more focused on their specific responsibilities

## Usage Examples

### Button Component

```tsx
<Button
  variant="primary"
  size="md"
  onClick={handleClick}
  isLoading={isLoading}
>
  Click Me
</Button>

<Button
  variant="icon"
  icon={<Check size={16} />}
  onClick={handleAction}
/>
```

### Card Component

```tsx
<Card interactive={true} onClick={handleCardClick}>
  <h3>Card Title</h3>
  <p>Card content goes here</p>
</Card>
```

### Modal Component

```tsx
<Modal
  isOpen={isModalOpen}
  onClose={closeModal}
  title="Modal Title"
  footer={<Button onClick={handleAction}>Confirm</Button>}
>
  <p>Modal content goes here</p>
</Modal>
```

### Custom Hooks

```tsx
// Using useTasks
const { tasks, completeTask, isTaskAvailable } = useTasks();

// Using useHarvest
const { showModal, rewards, handleClaim } = useHarvest();

// Using useStatIcon
const { getStatIcon } = useStatIcon();
const icon = getStatIcon("strength");
```
