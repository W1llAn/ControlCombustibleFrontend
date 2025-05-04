import { PrimeReactProvider } from "primereact/api";
import Home from "./pages/Home";
function App() {
  return (
    <>
      <PrimeReactProvider>
        <Home />
      </PrimeReactProvider>
    </>
  );
}

export default App;
