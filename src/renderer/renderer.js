// Функция переключения вкладок
function showTab(tabName) {
  const tabs = document.querySelectorAll(".tab");
  tabs.forEach((tab) => tab.classList.remove("active"));
  document.getElementById(tabName + "Tab").classList.add("active");

  if (tabName === 'telegram') checkTelegramAuth();
}

// VK - Старт анализа
async function startVkAnalysis() {
  const url = document.getElementById("groupUrl").value;
  const dateFrom = document.getElementById("dateFrom").value;
  const dateTo = document.getElementById("dateTo").value;

  if (!url || !dateFrom || !dateTo) {
    return alert(
      "Возможно вы не ввели ссылку на группу или не установили даты"
    );
  }

  try {
    const meta = await window.electron.invoke("vk:getGroupID", url);

    const posts = await window.electron.invoke("vk:getPosts", {
      groupId: meta.id,
      dateFrom,
      dateTo,
      title: meta.title,
      link: meta.link,
    });

    const { totalLikes, totalComments, totalViews } =
      await window.electron.invoke("vk:analyze", posts);

    console.log(
      `Лайки: ${totalLikes}, Комментарии: ${totalComments}, Просмотры: ${totalViews}`
    );

    await loadStatistics(dateFrom, dateTo);
  } catch (err) {
    console.error("Ошибка VK анализа:", err);
    alert("Что-то пошло не так при анализе VK");
  }
}

// Отмена анализа VK
function cancelVkAnalysis() {
  window.electron.invoke("vk:cancelAnalyze");
}

// Рендер статистики (для ВК и позже для Телеграма)
async function loadStatistics(from, to) {
  try {
    const stats = await window.electron.invoke("db:get-statistics", {
      from,
      to,
    });

    const statsBlock = document.getElementById("statsBlock");
    statsBlock.innerHTML = `
      <h3>Анализ данных</h3>
      <p>❤️ Лайков: ${stats.totalLikes}</p>
      <p>💬 Комментариев: ${stats.totalComments}</p>
      <p>👁️ Просмотров: ${stats.totalViews}</p>
      <p>🔁 Репостов: ${stats.totalReposts}</p>
    `;
  } catch (err) {
    console.error("Ошибка загрузки статистики:", err);
  }
}

//TG

// Навешиваем слушатели
window.onload = () => {
  showTab("vk");

  document
    .getElementById("startAnalysis")
    .addEventListener("click", startVkAnalysis);
  document
    .getElementById("cancelBtn")
    .addEventListener("click", cancelVkAnalysis);
};
