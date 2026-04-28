import { HJXAst } from "../types.js";

export interface ComponentDefinition {
  name: string;
  hjxPath: string;
  description: string;
}

export const builtInComponents: Record<string, ComponentDefinition> = {
  Button: {
    name: 'Button',
    hjxPath: 'src/components/Button.hjx',
    description: 'Standard button component with variants'
  },
  Card: {
    name: 'Card',
    hjxPath: 'src/components/Card.hjx',
    description: 'Card container with header/body/footer'
  },
  Input: {
    name: 'Input',
    hjxPath: 'src/components/Input.hjx',
    description: 'Form input field with label and validation'
  },
  Modal: {
    name: 'Modal',
    hjxPath: 'src/components/Modal.hjx',
    description: 'Overlay dialog component'
  },
  Form: {
    name: 'Form',
    hjxPath: 'src/components/Form.hjx',
    description: 'Form container with layout utilities'
  },
  Tabs: {
    name: 'Tabs',
    hjxPath: 'src/components/Tabs.hjx',
    description: 'Tabbed navigation component'
  },
  Alert: {
    name: 'Alert',
    hjxPath: 'src/components/Alert.hjx',
    description: 'Status message component'
  },
  Badge: {
    name: 'Badge',
    hjxPath: 'src/components/Badge.hjx',
    description: 'Small status indicator'
  },
  Spinner: {
    name: 'Spinner',
    hjxPath: 'src/components/Spinner.hjx',
    description: 'Loading indicator'
  },
  Dropdown: {
    name: 'Dropdown',
    hjxPath: 'src/components/Dropdown.hjx',
    description: 'Selection menu component'
  }
};

export function isBuiltInComponent(name: string): boolean {
  return name in builtInComponents;
}

export function getComponentDefinition(name: string): ComponentDefinition | undefined {
  return builtInComponents[name];
}
