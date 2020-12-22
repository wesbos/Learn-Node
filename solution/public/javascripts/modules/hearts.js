import axios from "axios";
import { $ } from "./bling";

async function ajaxHeart(e) {
  e.preventDefault();
  const form = e.target;
  try {
    const { data } = await axios.post(form.action);
    const isHearted = form.heart.classList.toggle("heart__button--hearted");
    $(".heart-count").textContent = data.hearts.length;
    if (isHearted) {
      form.heart.classList.add("heart__button--float");
      setTimeout(() => {
        form.heart.classList.remove("heart__button--float");
      }, 2500);
    }
  } catch (e) {
    console.log(e);
  }
}

export default ajaxHeart;
