import { USER_POSTS_PAGE } from "../routes.js";
import { renderHeaderComponent } from "./header-component.js";
import { dislikePost, likePost } from "../api.js";
import { posts, goToPage, user } from "../index.js";
const escapeHtml = (value) => {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
};
const formatDate = (dateString) => {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) {
    return "";
  }
  return date.toLocaleString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};
export function renderPostsPageComponent({ appEl }) {
  const postsHtml = posts
    .map((post) => {
      const userName = escapeHtml(post.user.name);
      const userImageUrl = escapeHtml(post.user.imageUrl);
      const postImageUrl = escapeHtml(post.imageUrl);
      const description = escapeHtml(post.description);
      const userId = escapeHtml(post.user.id);
      const postId = escapeHtml(post.id);
      const createdAt = escapeHtml(formatDate(post.createdAt));


      const likes = Array.isArray(post.likes) ? post.likes : [];
      const likesCount = post.likes.length;
      const likeImage = post.isLiked
        ? "./assets/images/like-active.svg"
        : "./assets/images/like-not-active.svg";
      return `
        <li class="post">
          <div class="post-header" data-user-id="${userId}">
            <img
              src="${userImageUrl}"
              class="post-header__user-image"
              alt="${userName}"
            >
            <p class="post-header__user-name">${userName}</p>
          </div>
          <div class="post-image-container">
            <img
              class="post-image"
              src="${postImageUrl}"
              alt="${description}"
            >
          </div>
          <div class="post-likes">
            <button
              type="button"
              data-post-id="${postId}"
              class="like-button"
            >
              <img src="${likeImage}" alt="Лайк">
            </button>
            <p class="post-likes-text">
              Нравится: <strong>${likesCount}</strong>
            </p>
          </div>
          <p class="post-text">
            <span class="user-name">${userName}</span>
            ${description}
          </p>
          <p class="post-date">
            ${createdAt}
          </p>
        </li>
      `;
    })
    .join("");
  const appHtml = `
    <div class="page-container">
      <div class="header-container"></div>
      <ul class="posts">
        ${postsHtml}
      </ul>
    </div>
  `;
  appEl.innerHTML = appHtml;
  renderHeaderComponent({
    element: document.querySelector(".header-container"),
  });
  for (const userEl of appEl.querySelectorAll(".post-header")) {
    userEl.addEventListener("click", () => {
      goToPage(USER_POSTS_PAGE, {
        userId: userEl.dataset.userId,
      });
    });
  }
  for (const likeButton of appEl.querySelectorAll(".like-button")) {
    likeButton.addEventListener("click", (event) => {
      event.stopPropagation();
      if (!user) {
        alert("Чтобы поставить лайк, войдите в аккаунт");
        return;
      }
      const postId = likeButton.dataset.postId;
      const post = posts.find((item) => item.id === postId);
      if (!post) {
        return;
      }
      const request = post.isLiked ? dislikePost : likePost;
      request({
        token: `Bearer ${user.token}`,
        postId,
      })
        .then((updatedPost) => {
          const postIndex = posts.findIndex((item) => item.id === postId);
          if (postIndex !== -1) {
            posts[postIndex] = updatedPost;
          }
          renderPostsPageComponent({ appEl });
        })
        .catch((error) => {
          console.error(error);
          alert("Не удалось изменить лайк");
        });
    });
  }
}