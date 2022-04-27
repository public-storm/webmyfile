import el from "element-ui/src/locale/lang/el";

export default {
    selectFile() {
        let upload = document.querySelector("#upload"),
            upload_inp = upload.querySelector(".upload_inp"),
            upload_button_select = upload.querySelector(".upload_button.select"),
            upload_button_upload = upload.querySelector(".upload_button.upload"),
            upload_list = upload.querySelector(".upload_list");
        // button触发input
        upload_button_select.addEventListener("click", function () {
            upload_inp.click()
        })
        upload_inp.addEventListener("change", function () {
            let file = upload_inp.files[0];
            console.log(file.name)
            upload_list.style.display = "block";
            upload_list.innerHTML = '<li><span>文件:'+file.name+'</span><span><em>移除</em></span></li>';
        })
    }
}



