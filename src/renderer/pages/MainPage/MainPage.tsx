import { useNavigate } from "react-router-dom";

export const MainPage = () => {
  const navigate = useNavigate();
  return (
    <div>
      MainPage
      <div>
        <button
          type="button"
          onClick={() => {
            navigate("/youtube");
          }}
        >
          youtube
        </button>
        <button
          type="button"
          onClick={() => {
            navigate("/vk");
          }}
        >
          vk
        </button>
        <button
          type="button"
          onClick={() => {
            navigate("/telegram");
          }}
        >
          tg
        </button>
      </div>
    </div>
  );
};
