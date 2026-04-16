export const YouTubePage = () => {
  return (
    <div>
      YouTube
      <button
        onClick={async () => {
          const response = await window.electronAPI.platforms.create({
            name: "YouTube",
            slug: "YT",
          });
          console.log(response);
        }}
      >
        create_table
      </button>
      <button
        onClick={async () => {
          const response = await window.electronAPI.platforms.getAll();
          console.log(response);
        }}
      >
        get_all
      </button>
      <button
        onClick={async () => {
          const response = await window.electronAPI.platforms.getById(1);
          console.log(response);
        }}
      >
        get_by_id_1
      </button>
      <button
        onClick={async () => {
          const response = await window.electronAPI.platforms.deleteById(1);
          console.log(response);
        }}
      >
        delete_by_id_1
      </button>
      <button
        onClick={async () => {
          const response = await window.electronAPI.platforms.getAll();
          console.log(response);
        }}
        style={{color: "black"}}
      >
        get_platforms
      </button>
    </div>
  );
};
