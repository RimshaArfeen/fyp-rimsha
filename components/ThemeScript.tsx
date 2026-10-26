export default function ThemeScript() {
  const code = `try{if(localStorage.getItem("pulse-theme")==="dark"){document.documentElement.setAttribute("data-theme","dark");}}catch(e){}`;
  return <script dangerouslySetInnerHTML={{ __html: code }} />;
}