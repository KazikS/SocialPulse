export const YouTubePage = () => {
  const pingFn = async () => {
    await window.electronAPI.ping();
  };
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
    </div>
  );
};
