// Import original module declarations
import 'styled-components';

// Extend them with your own theme
declare module 'styled-components' {
  export interface DefaultTheme {
    colors: {
      primary: string;
      secondary: string;
      background: string;
      text: string;
      light: string;
      dark: string;
      danger: string;
      success: string;
      white: string;
    };
    breakpoints: {
      mobile: string;
      tablet: string;
      desktop: string;
      large: string;
    };
  }
}
