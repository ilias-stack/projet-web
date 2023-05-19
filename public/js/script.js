let currentUser = null;

//* counts the number of articles that were downloaded
var load_count = 0;

$(document).ready(function () {
  //!check if user is logged
  login(true);
  //! toggle drop menu
  const rightSVG = $("#RightSVG");
  const dropMenu = $("#sub-menu-wrap");
  rightSVG.click(function (e) {
    if (dropMenu.css("opacity") == "0")
      dropMenu.css("visibility", "visible").animate({ opacity: "1" }, 300);
    else
      dropMenu.animate({ opacity: "0" }, 300, () => {
        dropMenu.css("visibility", "hidden");
      });
  });

  //! display categories
  const categorieList = $("#categorieList");
  getCategories();

  //! display articles
  const articleList = $("#articleList");
  addArticles();

  //! adding auto generate if user is in the bottom of page
  const loadingIndicator = document.getElementById("loadingIndicator");
  $(window).scroll(function () {
    const rect = loadingIndicator.getBoundingClientRect();
    if (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <=
        (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    )
      addArticles();
  });
  const searchInput = $("#searchBar input");
  searchInput.keypress(function (e) {
    if (e.keyCode === 13) {
      load_count = 0;
      const articlesWithText = $("#articleList")
        .children(".article")
        .filter(function () {
          return $(this).text().includes(searchInput.val());
        });
      articleList.html(articlesWithText);
    }
  });

  //! implementing the log-in modal
  const loginButton = $(".sub-menu-link p");
  loginButton.click(function (e) {
    showLoginModal();
  });

  //! close modal with X button
  const closeButton = $(".closeFormButton");
  closeButton.click(function (e) {
    const parentElement = $(this).parent();
    parentElement[0].close();
  });

  //! toggle between login and singup
  let formButtons = $(".formButton");
  formButtons.click(function (e) {
    const header = $("#loginForm h1");
    const target = $(e.target);
    if (header.text() == target.text()) {
      const inputs = $("#login input");
      if (target.text() == "Sign-up") {
        signin(inputs[0].value, inputs[1].value, inputs[2].value);
      } else {
        login(false, inputs[0].value, inputs[1].value);
      }
    } else {
      const str = header.text();
      header.text(target.text());
      console.log();
      if (header.text() == "Sign-up")
        $("#login").html(`<div class="email">
        <label for="username" style="cursor: pointer"
          ><svg
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            class="bi bi-tag"
            viewBox="0 0 16 16"
          >
            <path
              d="M6 4.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm-1 0a.5.5 0 1 0-1 0 .5.5 0 0 0 1 0z"
            />
            <path
              d="M2 1h4.586a1 1 0 0 1 .707.293l7 7a1 1 0 0 1 0 1.414l-4.586 4.586a1 1 0 0 1-1.414 0l-7-7A1 1 0 0 1 1 6.586V2a1 1 0 0 1 1-1zm0 5.586 7 7L13.586 9l-7-7H2v4.586z"
            /></svg></label
        ><input type="text" name="username" placeholder="Fullname" />
      </div>
      <br />
      <div class="email">
        <label for="email" style="cursor: pointer"
          ><svg
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            class="bi bi-envelope"
            viewBox="0 0 16 16"
          >
            <path
              d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4Zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1H2Zm13 2.383-4.708 2.825L15 11.105V5.383Zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741ZM1 11.105l4.708-2.897L1 5.383v5.722Z"
            /></svg></label
        ><input type="email" name="email" placeholder="Email" />
      </div>
      <br />
      <div class="email">
        <label for="password" style="cursor: pointer"
          ><svg
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            class="bi bi-lock"
            viewBox="0 0 16 16"
          >
            <path
              d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2zM5 8h6a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z"
            /></svg></label
        ><input type="password" name="password" placeholder="Password" />
      </div>
      <br />`);
      else
        $("#login").html(`<div class="email">
      <label for="email" style="cursor: pointer"
        ><svg
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          class="bi bi-envelope"
          viewBox="0 0 16 16"
        >
          <path
            d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4Zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1H2Zm13 2.383-4.708 2.825L15 11.105V5.383Zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741ZM1 11.105l4.708-2.897L1 5.383v5.722Z"
          /></svg></label
      ><input type="email" name="email" placeholder="Email" />
    </div>
    <br />
    <div class="email">
      <label for="password" style="cursor: pointer"
        ><svg
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          class="bi bi-lock"
          viewBox="0 0 16 16"
        >
          <path
            d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2zM5 8h6a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z"
          /></svg></label
      ><input type="password" name="password" placeholder="Password" />
    </div>
    <br />`);
      formButtons.first().text(header.text());
      formButtons.last().text(str);
    }
  });

  $("#fileChooser").click(function (e) {
    $("#actualFileChooser").click();
  });

  //! add Blog implementation
  const newBlogButton = $("#RightOption");
  newBlogButton.click(function (e) {
    if (currentUser) document.getElementById("blogForm").show();
    else alert("You must login!");
  });

  const postBlog = $("#postBlogButton");
  postBlog.click(async function (e) {
    const imageInput = document.getElementById("actualFileChooser");
    var imageId = null;

    const formData = new FormData();
    formData.append("image", imageInput.files[0]);
    const title = $("#blogForm input[type=text]");
    const content = $("#blogForm textarea");
    if (title != "" && content != "") {
      if (imageInput.files[0]) {
        await fetch("/articles/Image", {
          method: "POST",
          body: formData,
        })
          .then((response) => {
            if (response.ok) {
              return response.json();
            } else {
              throw new Error("Error uploading image");
            }
          })
          .then((data) => {
            imageId = data.id;
            console.log(imageId);
          })
          .catch((error) => {
            console.error("Error uploading image:", error);
          });
      }
      await fetch("/articles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title[0].value,
          content: content[0].value,
          userId: currentUser.id,
          imageId: imageId,
        }),
      })
        .then((result) => {
          if (result.ok) {
            location.reload();
          }
        })
        .catch((err) => console.log);
    }
  });
});

//! adding the comment section to each article
async function showCommentSection(articleId) {
  if (currentUser) {
    const commentSection = document.getElementById("articleComment");
    commentSection.showModal();
    const commentsList = $("#articleComment div.comments");
    commentsList.empty();

    const comments = await fetch(`/comments/${articleId}`);
    const data = await comments.json();

    data.forEach((element) => {
      $(`<div class="comment">
        <h4>${element.email}</h4>
        <p>${element.content}</p>
      </div>`).appendTo(commentsList);
    });

    const postCommentButton = $("#personalComment button");
    postCommentButton.off("click"); // Remove existing click event handlers
    postCommentButton.on("click", async function (e) {
      if ($("#personalComment input").val() != "") {
        const data = {
          email: currentUser.email,
          content: $("#personalComment input").val(),
          articleId,
        };
        await fetch("/comments", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        })
          .then((response) => {
            if (response.ok) {
              return response.json();
            } else {
              throw new Error("Request failed with status: " + response.status);
            }
          })
          .then((responseData) => {
            $(`<div class="comment">
              <h4>${responseData.email}</h4>
              <p>${responseData.content}</p>
            </div>`).appendTo(commentsList);
            $("#personalComment input").val("");
          })
          .catch((error) => {
            console.error("Error:", error);
          });
      }
    });
  } else alert("You must login!");
}

//! if  sessionCheck=true then the function will only check if the user is logged in
async function login(sessionCheck, email, password) {
  let user;
  if (sessionCheck) user = await fetch(`/users/session`);
  else user = await fetch(`/users/login?email=${email}&password=${password}`);

  if (user.ok) {
    currentUser = await user.json();
    $("#sub-menu").html(
      `
      <div id="user-info">
      <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      class="bi bi-person"
      viewBox="0 0 16 16"
    >
      <path
        d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4Zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10Z"
      />
    </svg>
        <h3>${currentUser.name}</h3>
      </div>
      <hr />
      <a class="sub-menu-link" href="/users/logout" >
      <svg xmlns="http://www.w3.org/2000/svg" width="30" fill="currentColor" class="bi bi-box-arrow-left" viewBox="0 0 16 16">
      <path fill-rule="evenodd" d="M6 12.5a.5.5 0 0 0 .5.5h8a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5h-8a.5.5 0 0 0-.5.5v2a.5.5 0 0 1-1 0v-2A1.5 1.5 0 0 1 6.5 2h8A1.5 1.5 0 0 1 16 3.5v9a1.5 1.5 0 0 1-1.5 1.5h-8A1.5 1.5 0 0 1 5 12.5v-2a.5.5 0 0 1 1 0v2z"/>
      <path fill-rule="evenodd" d="M.146 8.354a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L1.707 7.5H10.5a.5.5 0 0 1 0 1H1.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3z"/>
    </svg>
        <p>Log-out</p>
      </a>
    `
    );
    document.getElementById("loginForm").close();
    return;
  }
  console.log((currentUser = null));
}

async function signin(name, email, password) {
  try {
    const response = await fetch("/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password }),
    });

    if (response.ok) {
      const currentUser = await response.json();
      login(false, currentUser.email, currentUser.password);
    } else {
      const errorData = await response.json();
      console.error("Error occurred:", errorData.message);
    }
  } catch (error) {
    console.error("Error occurred:", error);
  }
}

function showLoginModal() {
  document.getElementById("loginForm").showModal();
}

async function addArticles(categorieType = "") {
  const options = { day: "numeric", month: "long", year: "numeric" };
  if (categorieType == "") {
    const response = await fetch(`/articles?skip=${load_count}&take=10`);
    const data = await response.json();
    load_count += data.length;
    console.log(load_count);
    data.forEach(async (articleObj) => {
      const user = await fetch(`/users/${articleObj.userId}`);
      const { name } = await user.json();
      const categoriesReq = await fetch(
        `/articles/articlecategorie/${articleObj.id}`
      );
      const categories = await categoriesReq.json();
      const categorieList = [];
      const fetchCategory = async (categorieObj) => {
        const categoriesReq = await fetch(
          `/categories/${categorieObj.categorieId}`
        );
        const categorie = await categoriesReq.json();
        categorieList.push(categorie.name);
      };

      const fetchCategories = categories.map(fetchCategory);
      await Promise.all(fetchCategories);

      const article = $("<div>", { class: "article" });
      //! article assembling
      {
        const date = new Date(articleObj.createdAt);
        const articleHead = $(`<div class="articleHead">
        <svg
          fill="currentColor"
          class="articleOwnerCard"
          viewBox="0 0 16 16"
        >
          <path
            d="M5 8a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm4-2.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1h-4a.5.5 0 0 1-.5-.5ZM9 8a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1h-4A.5.5 0 0 1 9 8Zm1 2.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5Z"
          />
          <path
            d="M2 2a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H2ZM1 4a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H8.96c.026-.163.04-.33.04-.5C9 10.567 7.21 9 5 9c-2.086 0-3.8 1.398-3.984 3.181A1.006 1.006 0 0 1 1 12V4Z"
          />
        </svg>
        <div style="margin: 3px">
          <strong style="text-decoration: underline;cursor:pointer;">${name}</strong>
          <div style="color: grey; font-size: 14px">
            Published : <strong>${date.toLocaleDateString(
              "en-US",
              options
            )}</strong>
          </div>
        </div>
      </div>`).click(function (e) {
          $("#searchBar input").val($(e.target).text());
          $("html, body").animate({ scrollTop: 0 }, "slow");
        });
        let image = "";
        if (articleObj.imageId != null)
          image =
            $(`<img src="http://localhost:5000/articles/Image/${articleObj.imageId}" alt="Blog"
        class="articleImage"
      />`);

        const articleData = $("<div>", { class: "articleData" });
        //! articleData assembling
        {
          const articleCategories = $("<div>", { class: "articleCategories" });

          for (let i = 0; i < categorieList.length; i++) {
            const element = categorieList[i];
            const categorie = $(`<p class="categorie">${element}</p>`);
            articleCategories.append(categorie);
          }
          const articleTitle = $(`<div class="articleTitle">
          ${articleObj.title}
        </div>`);
          const articleContent = $(`<p>${articleObj.content}</p>`);
          const articleComments = $(
            '<div class="readComments">Read comments &#8594</div>'
          ).on("click", function () {
            showCommentSection(articleObj.id);
          });
          articleData.append(articleCategories);
          articleData.append(articleTitle);
          articleData.append(articleContent);
          articleData.append(articleComments);
        }
        //! article assembling
        article.append(articleHead);
        article.append(image);
        article.append(articleData);
      }
      //! adding article to the articleList
      article.appendTo(articleList);
    });
  } else {
    const response = await fetch(`/categories/${categorieType}`);
    const { id } = await response.json();
    const articles = await fetch(`/categories/articlecategorie/${id}`);
    const data = await articles.json();
    data.forEach(async (element) => {
      $("#articleList").empty();
      load_count = 0;
      const { articleId } = element;
      const response = await fetch(`/articles/${articleId}`);
      const articleObj = await response.json();

      const user = await fetch(`/users/${articleObj.userId}`);
      const { name } = await user.json();
      const categoriesReq = await fetch(
        `/articles/articlecategorie/${articleObj.id}`
      );
      const categories = await categoriesReq.json();
      const categorieList = [];
      const fetchCategory = async (categorieObj) => {
        const categoriesReq = await fetch(
          `/categories/${categorieObj.categorieId}`
        );
        const categorie = await categoriesReq.json();
        categorieList.push(categorie.name);
      };

      const fetchCategories = categories.map(fetchCategory);
      await Promise.all(fetchCategories);

      const article = $("<div>", { class: "article" });
      //! article assembling
      {
        const date = new Date(articleObj.createdAt);
        const articleHead = $(`<div class="articleHead">
        <svg
          fill="currentColor"
          class="articleOwnerCard"
          viewBox="0 0 16 16"
        >
          <path
            d="M5 8a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm4-2.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1h-4a.5.5 0 0 1-.5-.5ZM9 8a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1h-4A.5.5 0 0 1 9 8Zm1 2.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5Z"
          />
          <path
            d="M2 2a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H2ZM1 4a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H8.96c.026-.163.04-.33.04-.5C9 10.567 7.21 9 5 9c-2.086 0-3.8 1.398-3.984 3.181A1.006 1.006 0 0 1 1 12V4Z"
          />
        </svg>
        <div style="margin: 3px">
          <strong style="text-decoration: underline">${name}</strong>
          <div style="color: grey; font-size: 14px">
            Published : <strong>${date.toLocaleDateString(
              "en-US",
              options
            )}</strong>
          </div>
        </div>
      </div>`);
        let image = "";
        if (articleObj.imageId != null)
          image =
            $(`<img src="http://localhost:5000/articles/Image/${articleObj.imageId}" alt="Blog"
        class="articleImage"
      />`);

        const articleData = $("<div>", { class: "articleData" });
        //! articleData assembling
        {
          const articleCategories = $("<div>", { class: "articleCategories" });

          for (let i = 0; i < categorieList.length; i++) {
            const element = categorieList[i];
            let categorie;
            if (categorieType != element) {
              categorie = $(`<p class="categorie">${element}</p>`);
            } else {
              categorie = $(`<p class="categorieSelected">${element}</p>`);
            }
            articleCategories.append(categorie);
          }
          const articleTitle = $(`<div class="articleTitle">
          ${articleObj.title}
        </div>`);
          const articleContent = $(`<p>${articleObj.content}</p>`);
          const articleComments = $(
            '<div class="readComments">Read comments &#8594</div>'
          ).on("click", function () {
            showCommentSection(articleObj.id);
          });
          articleData.append(articleCategories);
          articleData.append(articleTitle);
          articleData.append(articleContent);
          articleData.append(articleComments);
        }
        //! article assembling
        article.append(articleHead);
        article.append(image);
        article.append(articleData);
      }
      //! adding article to the articleList
      article.appendTo(articleList);
    });
  }
}

async function getCategories() {
  try {
    const response = await fetch("/categories?take=10");
    const data = await response.json();

    for (const element of data) {
      const categorie = $("<p>", { class: "categorie" });

      try {
        const articleResponse = await fetch(
          "/categories/articlecategorie/" + element.id
        );
        const articleData = await articleResponse.json();

        const categorieText = $("<span>").text(element.name + " ");
        const articleCount = $("<strong>").text(articleData.length);

        categorie.append(categorieText, articleCount);
      } catch (err) {
        console.log(
          `Error fetching articles for category ${element.name}: ${err}`
        );
        const categorieText = $("<span>").text(element.name);
        categorie.append(categorieText);
      }

      categorie.appendTo(categorieList);
    }

    $("#categorieList")
      .children()
      .on("click", (event) => {
        const selectedCategorie = $(".categorieSelected:first");
        selectedCategorie
          .removeClass("categorieSelected")
          .addClass("categorie");
        let target = $(event.target);
        if (
          target.prop("tagName").toLowerCase() == "strong" ||
          target.prop("tagName").toLowerCase() == "span"
        )
          target = target.parent();
        target.removeClass("categorie").addClass("categorieSelected");
        const cateName = target.text().split(" ").slice(0, -1).join(" ");
        addArticles(cateName);
      });
  } catch (err) {
    console.error(`Error fetching categories: ${err}`);
  }
}
