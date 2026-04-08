import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  :root {
    --primary-bg: #F9F4F0;    
    --secondary-dark: #5D3F5E; 
    --accent: #C5A367;       
    --accent-dark: #A57C4B;
    --bg-site: #F9F4F0;  
    --text: #4a4a4a;         
    --text-light: #8c8c8c;   
    --white: #ffffff;
    --success: #c1d5c0;      
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    background-color: var(--primary-bg);
    color: var(--text);
    -webkit-font-smoothing: antialiased;
    overflow-x: hidden;
    font-family: 'Montserrat', sans-serif;
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: 'Bonheur Royale', sans-serif;
    color: var(--secondary-dark);
    text-transform: none; 
    letter-spacing: normal;
    margin-bottom: 20px;
    text-align: center;
  }

  p, span, input, textarea, button, label {
    font-family: 'Montserrat', sans-serif;
  }

  button {
    cursor: pointer;
    border: none;
    transition: all 0.3s ease;
  }
`;

export default GlobalStyle;