<?php
if (getenv("REQUEST_METHOD")==="POST") {
    echo ("POST");
    echo($_POST["lang"]);
} else {
    echo ("GET");
    echo($_GET["lang"]);
}

?>