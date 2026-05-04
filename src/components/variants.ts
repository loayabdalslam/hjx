import { DesignTokens, defaultTokens } from '../design-system/index.js';

export interface ComponentVariant {
  name: string;
  props: Record<string, any>;
  styles: string;
}

export const buttonVariants: Record<string, ComponentVariant> = {
  primary: {
    name: 'primary',
    props: { variant: 'button-primary' },
    styles: 'button-primary'
  },
  secondary: {
    name: 'secondary',
    props: { variant: 'button-secondary' },
    styles: 'button-secondary'
  },
  danger: {
    name: 'danger',
    props: { variant: 'button-danger' },
    styles: 'button-danger'
  },
  outline: {
    name: 'outline',
    props: { variant: 'button-outline' },
    styles: 'button-outline'
  },
  ghost: {
    name: 'ghost',
    props: { variant: 'button-ghost' },
    styles: 'button-ghost'
  }
};

export const cardVariants: Record<string, ComponentVariant> = {
  elevated: {
    name: 'elevated',
    props: { elevation: 'md' },
    styles: 'card-elevated'
  },
  flat: {
    name: 'flat',
    props: { elevation: 'none' },
    styles: 'card-flat'
  }
};

export const allVariants = {
  Button: buttonVariants,
  Card: cardVariants
};
