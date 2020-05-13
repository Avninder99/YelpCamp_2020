var show = document.querySelector(".showpass");
var input = document.querySelector(".passinput");
show.addEventListener("click",function(){
	if(input.type === "password"){
		input.type = "text";
	}else{
		input.type = "password";
	}
});