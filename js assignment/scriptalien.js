 const landingInput = document.getElementById("landingdate");
    landingInput.min = new Date().toISOString().split("T")[0];

    const form = document.querySelector('form');
    form.addEventListener('submit', function(e) {
        e.preventDefault();

        
        const planetname = document.getElementById('planetname').value.trim();
        const antennacount = document.getElementById('antennacount').value.trim();
        const humanphrase = document.getElementById('humanphrase').value.trim();
        const landingdate = document.getElementById('landingdate').value;
        const alienid = document.getElementById('alienid').value.trim();


       
        const errorplanetname = document.getElementById('errorplanetname');
        const errorantennacount = document.getElementById('errorantennacount');
        const errorhumanphrase = document.getElementById('errorhumanphrase');
        const erroralienid = document.getElementById('erroralienid');

        let valid = true;

    
        const planetnamepattern = /^(?=.*[aeiouAEIOU])(?=.*\d)[A-Za-z\d]+$/;
        if(!planetnamepattern.test(planetname)) {
            errorplanetname.innerText = "Planet name must contain at least one vowel and one digit";
            errorplanetname.style.color = "red";
            valid = false;
        } else {
            errorplanetname.innerText = "";
        }

       
        const antennapattern = /^[0-9]*[02468]$/;
        if(!antennapattern.test(antennacount) || antennacount === "") {
            errorantennacount.innerText = "Antenna count must be even";
            errorantennacount.style.color = "red";
            valid = false;
        } else {
            errorantennacount.innerText = "";
        }

        

    const alienIdPattern = /^[A-Z]{3}-[A-Z]{2}_[0-9]{4}@[A-Z]+$/;
    if(!alienIdPattern.test(alienid)) {
    erroralienid.innerText = "Alien ID must match pattern like ZOR-XY_9999@UFO";
    erroralienid.style.color = "red";
    valid = false;
    } else {
    erroralienid.innerText = "";
    }

        const humanphrasepattern = /^(?=.*[\p{P}\p{S}]).+$/u;
        if(!humanphrasepattern.test(humanphrase)) {
            errorhumanphrase.innerText = "Human phrase must contain at least one emoji or punctuation";
            errorhumanphrase.style.color = "red";
            valid = false;
        } else {
            errorhumanphrase.innerText = "";
        }

        
        const currentdate = new Date();
        currentdate.setHours(0,0,0,0); 
        const selectedDate = new Date(landingdate);
        if(selectedDate < currentdate || landingdate === "") {
            alert("Landing date should not be a past date");
            valid = false;
        }

       
        if(valid){
            window.location.href = "success.html";
        }
    });