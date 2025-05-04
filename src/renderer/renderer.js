// Функция переключения вкладок
function showTab(tabName) {
  const tabs = document.querySelectorAll(".tab");
  tabs.forEach((tab) => tab.classList.remove("active"));
  document.getElementById(tabName + "Tab").classList.add("active");

  if (tabName === "telegram") {
    window.electron.send("startTelegramAuth"); // запускаем авторизацию
  }
}

window.electron.on("authSuccess", () => {
  alert("✅ Telegram авторизация успешна!");
  // можешь скрыть блоки ввода или показать данные
});

window.electron.on("authError", (event, message) => {
  alert("❌ Ошибка авторизации: " + message);
});

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
      `Лайки: ${totalLikes}, Комментарии: ${totalComments}, Просмотры: ${totalViews}, id канала ${
        meta.id
      }, тип id канала ${typeof meta.id}`
    );
    console.log(meta.id + "\n" + typeof meta.id);
    await loadStatistics(dateFrom, dateTo, parseInt(meta.id), "vk");
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
async function loadStatistics(from, to, externalChannelId, platform, keyword) {
  try {
    const channelId = await window.electron.invoke(
      "db:get-channel-id",
      externalChannelId
    );
    if (!channelId) {
      console.warn("Не найден внутренний channel_id для", externalChannelId);
      return;
    }

    const fromDate = new Date(from);
    fromDate.setHours(0, 0, 0, 0);

    const toDate = new Date(to);
    toDate.setHours(23, 59, 59, 999);

    const stats = await window.electron.invoke("db:get-statistics", {
      from: fromDate.toISOString(),
      to: toDate.toISOString(),
      channelId,
    });

    let statsBlock = null;
    switch (platform) {
      case "vk":
        statsBlock = document.getElementById("statsBlock");
        statsBlock.innerHTML = `
          <h3>Анализ данных</h3>
          <p>📰 Постов: ${stats.totalPosts}</p>
          <p>❤️ Лайков: ${stats.totalLikes}</p>
          <p>💬 Комментариев: ${stats.totalComments}</p>
          <p>👁️ Просмотров: ${stats.totalViews}</p>
          <p>🔁 Репостов: ${stats.totalReposts}</p>
        `;
        break;
      case "tg":
        statsBlock = document.getElementById("statsTgBlock");
        statsBlock.innerHTML = `
          <h3>Анализ данных</h3>
          <p>📰 Постов: ${stats.totalPosts}</p>
          <p>❤️ Лайков: ${stats.totalLikes}</p>
          <p>👁️ Просмотров: ${stats.totalViews}</p>
        `;
        break;
      case "web":
        statsBlock = document.getElementById("statsWebBlock");
        statsBlock.innerHTML = `
          <h3>Анализ данных</h3>
          <p>📰 Новостей в этом периоде: ${stats.totalPosts}</p>
        `;
        break;
      default:
        break;
    }
  } catch (err) {
    console.error("Ошибка загрузки статистики:", err);
  }
}

//TG
document.getElementById("startAuth").addEventListener("click", () => {
  showStatus("Начинается авторизация в Telegram...");
  window.electron.send("startTelegramAuth");
});

document.getElementById("sendPhone").addEventListener("click", () => {
  const phone = document.getElementById("phone").value;
  window.electron.send("phoneNumber", phone);
  console.log("send phone number");
});

document.getElementById("sendCode").addEventListener("click", () => {
  const code = document.getElementById("code").value;
  window.electron.send("phoneCode", code);
});

document.getElementById("sendPassword").addEventListener("click", () => {
  const password = document.getElementById("password").value;
  window.electron.send("password", password);
});

// Эти события тебе пригодятся, чтобы показывать следующие шаги:
window.electron.on("askCode", () => {
  document.getElementById("codeBlock").style.display = "block";
});

window.electron.on("askPassword", () => {
  document.getElementById("passwordBlock").style.display = "block";
});

window.electron.on("askNumber", () => {});

function showStatus(msg) {
  document.getElementById("statusMessage").innerText = msg;
  document.getElementById("errorMessage").innerText = "";
  document.getElementById("successMessage").innerText = "";
}

function showError(msg) {
  document.getElementById("statusMessage").innerText = "";
  document.getElementById("errorMessage").innerText = msg;
  document.getElementById("successMessage").innerText = "";
}

function showSuccess(msg) {
  document.getElementById("statusMessage").innerText = "";
  document.getElementById("errorMessage").innerText = "";
  document.getElementById("successMessage").innerText = msg;
}

window.electron.on("authSuccess", () => {
  showSuccess("Вы уже авторизованы.");
  document.getElementById("authBlock").classList.add("hidden");
});

async function startTgAnslysis() {
  const url = document.getElementById("channelUrl").value;
  const dateFrom = document.getElementById("dateFromTG").value;
  const dateTo = document.getElementById("dateToTG").value;

  if (!url || !dateFrom || !dateTo) {
    return alert(
      "Возможно вы не ввели ссылку на группу или не установили даты"
    );
  }

  try {
    const info = await window.electron.invoke("tg:getChannelInfo", url);
    console.log(info.channelid, info.channelHash, info.channelTitle, info.url);
    const posts = await window.electron.invoke("tg:getTgPosts", {
      channelid: info.channelid,
      channelHash: info.channelHash,
      dateFromTG: dateFrom,
      dateToTG: dateTo,
      title: info.channelTitle,
      link: info.url,
    });

    const { totalLikes, totalViews } = await window.electron.invoke(
      "tg:analyze",
      posts
    );
    console.log(
      `Channel id = ${info.channelid}, typeof id ${typeof info.channelid}`
    );
    await loadStatistics(dateFrom, dateTo, parseInt(info.channelid), "tg");
  } catch (error) {
    console.error(`Error: ${error}`);
  }
}

//web
async function startWebScrapping() {
  const url = document.getElementById("urlInputWeb").value;
  const dateFrom = document.getElementById("dateFromWeb").value;
  const dateTo = document.getElementById("dateToWeb").value;

  if (!url || !dateFrom || !dateTo) {
    return alert(
      "Возможно вы не ввели ссылку на группу или не установили даты"
    );
  }
  try {
    const posts = await window.electron.invoke("web:scrape", {
      url,
      dateFromWeb: dateFrom,
      dateToWeb: dateTo,
    });
    let external_id = new URL(posts[0].link).hostname;
    await loadStatistics(dateFrom, dateTo, external_id, "web");
    return posts;
  } catch (error) {
    console.error(`Error ${error}`);
  }
}

// Навешиваем слушатели
window.onload = () => {
  showTab("vk");

  document
    .getElementById("startAnalysis")
    .addEventListener("click", startVkAnalysis);
  document
    .getElementById("cancelBtn")
    .addEventListener("click", cancelVkAnalysis);
  document
    .getElementById("startAnalysisTG")
    .addEventListener("click", startTgAnslysis);
  document
    .getElementById("startScrape")
    .addEventListener("click", startWebScrapping);
};
