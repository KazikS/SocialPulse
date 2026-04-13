export const YouTubePage = () => {
  return (
    <div>
      YouTube
      <button
        onClick={async () => {
          const response = await window.electronAPI.ping();
          console.log(response);
        }}
      >
        Ping
      </button>
      <button
        onClick={async () => {
          const response = await window.electronAPI.test_db();
          console.log(response);
        }}
      >
        test_db
      </button>
    </div>
  );
};
