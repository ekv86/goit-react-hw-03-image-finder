import { ImageSearch } from "./ImageSearch"

export const App = () => {
  return (
    <div className=""
      style={{
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: 40,
        color: '#010101'
      }}
    >
      <ImageSearch/>
    </div>
  );
};
