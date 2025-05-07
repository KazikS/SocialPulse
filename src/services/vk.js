require("dotenv").config();
const { VK } = require("vk-io");

const vk = new VK({
  token: process.env.VK_SERVICE_KEY || '9839bfe69839bfe69839bfe6569b1610a6998399839bfe6f03c77bc8185ce1e99724197',
});

let canceledRequest = false;

function cancelRequest() {
  canceledRequest = true;
}

// получение id группы ВКонтакте
async function getVkGroupID(url) {
  const match = url.match(/vk\.com\/([\w\d_.-]+)/i);
  if (!match) throw Error("Invalid url!");
  const response = await vk.api.groups.getById({
    group_id: match[1],
  })
  const group = response.groups[0];
  return {
    id: group.id,
    title: group.name,
    screen_name: group.screen_name,
    link: `https://vk.com/${group.screen_name}`
  }
}

// извлечение постов
async function getVkPosts({ groupId, dateFrom, dateTo }) {
  canceledRequest = false;
  let offset = 0;
  let count = 100; // максимальное количество записей на запрос
  let allPosts = []; // массив для хранения всех постов
  let hasMorePosts = true;
  let start = Math.floor(new Date(dateFrom).setHours(0, 0, 0, 0) / 1000); // преобразуем в секунды
  let end = Math.floor(new Date(dateTo).setHours(23, 59, 59, 999) / 1000); // преобразуем в секунды

  let cicleCount = 0;
  try {
    while (hasMorePosts && !canceledRequest) {
      cicleCount++;

      const response = await vk.api.wall.get({
        owner_id: `-${groupId}`, // для групп ID всегда с минусом
        offset: offset,
        count: count,
      });

      const posts = response.items;
      if (posts.length < count || posts[posts.length - 1].date <= start) {
        hasMorePosts = false;
      }

      allPosts = allPosts.concat(posts);
      offset += count; // сдвиг по записи
    }
  } catch (error) {
    console.error("Ошибка VK API:", error.message);
  }

  const filtered = allPosts.filter((post) => {
    const postDate = post.date;
    return postDate >= start && postDate <= end;
  });

  if (filtered.length === 0) {
    console.log("Нет постов в указанном диапазоне.");
    return [];
  }

  console.log(
    cicleCount +
      "\n" +
      filtered.length +
      "\n" +
      `Дата последнего поста в промежутке: ${
        filtered[filtered.length - 1].date
      }` +
      "\n" +
      `Дата первого поста в промежутке: ${filtered[0].date}`
  );
  return filtered;
}

function analyzeVkPosts(posts) {
  if (!Array.isArray(posts) || posts.length === 0)
    return {
      totalLikes: 0,
      totalComments: 0,
      totalViews: 0,
    };

  let numberPosts = posts.length;
  let totalLikes = 0;
  let totalComments = 0;
  let totalViews = 0;
  let totalReposts = 0;

  for (const post of posts) {
    totalLikes += post.likes?.count || 0;
    totalComments += post.comments?.count || 0;
    totalViews += post.views?.count || 0;
    totalReposts += post.reposts?.count  || 0;
  }

  console.log(`Likes count = ${totalLikes} \nComments count = ${totalComments} \nViews count = ${totalViews} \nReposts count = ${totalReposts}`);
  return { totalLikes, totalComments, totalViews, totalReposts };
}

module.exports = {
  getVkGroupID,
  getVkPosts,
  analyzeVkPosts,
  cancelRequest
};
