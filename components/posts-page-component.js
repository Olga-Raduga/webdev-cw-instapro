import { USER_POSTS_PAGE } from "../routes.js";
import { renderHeaderComponent } from "./header-component.js";
import { dislikePost, likePost } from "../api.js";
import { posts, goToPage, user } from "../index.js";
export function renderPostsPageComponent({ appEl }) {
  const postsHtml = posts
    .map((post) => {
      const userName = post.user.name;
      const userImageUrl = post.user.imageUrl;
      const likesCount = post.likes.length;
      const likeImage = post.isLiked
        ? "./assets/images/like-active.svg"
        : "./assets/images/like-not-active.svg";
      return `
        <li class="post">
          <div class="post-header" data-user-id="${post.user.id}">
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
              src="${post.imageUrl}"
              alt="${post.description}"
            >
          </div>
          <div class="post-likes">
            <button data-post-id="${post.id}" class="like-button">
              <img src="${likeImage}" alt="Лайк">
            </button>
            <p class="post-likes-text">
              Нравится: <strong>${likesCount}</strong>
            </p>
          </div>
          <p class="post-text">
            <span class="user-name">${userName}</span>
            ${post.description}
          </p>
          <p class="post-date">
            ${post.createdAt}
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
  for (const userEl of document.querySelectorAll(".post-header")) {
    userEl.addEventListener("click", () => {
      goToPage(USER_POSTS_PAGE, {
        userId: userEl.dataset.userId,
      });
    });
  }
  for (const likeButton of document.querySelectorAll(".like-button")) {
    likeButton.addEventListener("click", (event) => {
      event.stopPropagation();
      if (!user) {
        alert("Чтобы поставить лайк, войдите в аккаунт");
        return;
      }
      const postId = likeButton.dataset.postId;
      const post = posts.find((post) => post.id === postId);
      if (!post) {
        return;
      }
      const request = post.isLiked ? dislikePost : likePost;
      request({
        token: `Bearer ${user.token}`,
        postId,
      })
        .then((updatedPost) => {
          const postIndex = posts.findIndex((post) => post.id === postId);
          posts[postIndex] = updatedPost;
          renderPostsPageComponent({ appEl });
        })
        .catch((error) => {
          console.error(error);
          alert("Не удалось изменить лайк");
        });
    });
  }
}