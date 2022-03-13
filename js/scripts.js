
function Checkout()
{
    //reset html and css values that may be changed by the function
    document.getElementById('warningMessage').innerHTML = "";
    document.getElementById('productWarningMessage').innerHTML = "";

    //declare variables to store form inputs and regex
    var customerName = document.getElementById('nameBox').value;
    var emailAddress = document.getElementById('emailAddress').value;
    var creditCardNumber = document.getElementById('creditCardNumber').value;
    var creditCardMonth = document.getElementById('creditCardMonth').value;
    var creditCardYear = document.getElementById('creditCardYear').value;
    var creditCardFormat = new RegExp(/^[0-9]{4}-[0-9]{4}-[0-9]{4}-[0-9]{4}$/);
    var creditYearFormat = new RegExp(/^[0-9]{4}$/);
    var emailFormat = new RegExp(/^\S+@\S+\.\S+$/);
    var nameFormat = new RegExp(/^[a-zA-Z\'\- ]+$/);
    var itemName = ["Muffins", "Hats", "Sweaters", "Gloves", "Shiny Rocks"];
    const productPrice = [3, 7, 17, 5, 10]; 
    var nameValid = false;
    var emailValid = false;

    if (!customerName) //if customer name input is blank
    {
        document.getElementById('warningMessage').innerHTML += "Name input is required!<br>"; //show warning that it is required
    }
    else
    {
        customerName = customerName.trim(); //if input is not blank, trim input's whitespace
        let nameCheck = nameFormat.test(customerName); //validate name with regex
        if (nameCheck == false)
        {
            document.getElementById('warningMessage').innerHTML += "Name must not have numbers or special characters!<br>";
        }
        else
        {
            nameValid = true;
        }
    }

    if (!emailAddress) //if email address input is blank
    {
        document.getElementById('warningMessage').innerHTML += "Email input is required!<br>"; //show warning that it is required
    }
    else
    {
        emailAddress = emailAddress.trim(); //if input is not blank, trim input's whitespace
        let emailCheck = emailFormat.test(emailAddress); //validate email format with regex
        if (emailCheck === false)
        {
            document.getElementById('warningMessage').innerHTML += "Email input is not in formatted correctly!<br>";
        }
        else
        {
            emailValid = true;
        }
    }
    if (creditCardNumber) //if credit card number is input then validate it
    {
        creditCardNumber = creditCardNumber.trim(); //trim credit card number before putting through regex
        let ccNumberCheck = creditCardFormat.test(creditCardNumber); // validate credit card number is in correct format with regex
        if (ccNumberCheck === false)
        {
            document.getElementById('warningMessage').innerHTML += "Credit card number is not formatted correctly!<br>"; //if regex test returns false then show warning
        }
        else
        {
            var lastFourDigits = creditCardNumber.substr(15, 19);
        }
    }
    if (creditCardMonth) //if month is input then validate it
    {
        creditCardMonth = creditCardMonth.trim(); //trim month input before putting through regex
        if (!creditCardMonth.match(/^(JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)$/)) // validate month input with regex
        {
            document.getElementById('warningMessage').innerHTML += "Credit card month is not a valid month or is not capitalized!<br>";
        }
    }

    if (creditCardYear) //if year is input then validate it
    {
        creditCardYear = creditCardYear.trim(); //trim before regex
        let ccYearCheck = creditYearFormat.test(creditCardYear);
        if (ccYearCheck == false)
        {
            document.getElementById('warningMessage').innerHTML += "Credit card year must be a 4 digit number!<br>";
        }
    }
    if (nameValid == false || emailValid == false)
    {
        return;
    }
    ////////// Start Product Purchase Validation Code /////////////////
    var productQuantity = [];
    for (let i = 0; i<5; i++)
    {
        if (isNaN(document.getElementById(`product${i+1}`).value))
        {
            document.getElementById('productWarningMessage').innerHTML += "All inputs must be numbers or empty!";
            return;
        }
        else
        {
            productQuantity[i] = document.getElementById(`product${i+1}`).value;
        }
    }
    var minimumPurchase = false;
    for (let i = 0; i<5; i++) //loop through the length of the array
    {
        if (productQuantity[i] >= 1) //if at least one input is equal to or greater than 1, set bool to true and break loop
        {
            minimumPurchase = true;
            break;
        }
    }
    if (minimumPurchase == false) //if loop finishes and bool is false, show message that there is a minimum purchase of 1
    {
        document.getElementById('productWarningMessage').innerHTML += "You must purchase a minimum of one item!";
        return;
    }
    /////////// Generate customer info table /////////////////
    var customerInfoTable = `<h3>Thank you for your purchase!</h3>
    <table id=\"customerInfo\"> 
        <tr>
            <th class=\"headerColumn\">Name</th>
            <td id=\"customerName\">${customerName}</td>
        </tr>
        <tr>
            <th class=\"headerColumn\">Email</th>
            <td id=\"customerEmail\">${emailAddress}</td>
        </tr>`;
    if (creditCardNumber)
    {
        customerInfoTable += 
        `<tr>
            <th class=\"headerColumn\">Credit Card</th>
            <td id=\"creditCardLastFour\">xxxx-xxxx-xxxx-${lastFourDigits}</td>
        </tr>
    </table>`;
    }
    else
    {
        customerInfoTable +=
        `</table>`;
    }
    document.getElementById('mainContentSection').innerHTML = customerInfoTable; //create template of html code for table with correct variables then output it to the html
    ///////// Generate purchase receipt //////////////
    var totalCost = [];
    var purchaseReceiptTable = 
    `<table id=\"purchaseReceipt\">
    <tr class=\"headerRow\">
    <th>Item</th>
    <th>Quantity</th>
    <th>Unit Price</th>
    <th>Total Price</th>
    </tr>`; //create template of html code for table's header row, to be added onto in next code block
    for (let i = 0; i<5; i++) //for each product
    {
        if (productQuantity[i] >= 1) //if one or more of the item is being purchased
        {
            totalCost[i] = productQuantity[i] * productPrice[i]; //calculate the total cost of all units ordered
            purchaseReceiptTable +=  //add to existing table template with new row filled with correct information for product
            `<tr>
            <td>${itemName[i]}</td>
            <td>${productQuantity[i]}</td>
            <td>\$${productPrice[i].toFixed(2)}</td>
            <td>\$${totalCost[i].toFixed(2)}</td>
        </tr>`
        }
    }
    var donationAmount;
    var donationType;
    var totalBeforeDonate = 0;
    for (let i = 0; i < 5; i++) // calculate total cost before adding donation by going through each product cost
    {
        if (totalCost[i] === null || isNaN(totalCost[i]) || totalCost[i] < 0) //if cost is null or not a number or negative then total is not changed
        {
            totalBeforeDonate += 0;
        }
        else if (totalCost[i] > 0) //if cost is greater than 0 then cost is added into total
        {
            totalBeforeDonate += totalCost[i];
        }
    }  
    var tenPercent = totalBeforeDonate * 0.1; //calculate 10% of purchase total
    if (tenPercent > 10) //if 10% of purchase total is greater than 10$ then donationAmount is 10% of purchase total
    {
        donationAmount = tenPercent;
        donationType = "Percentage";
    }
    else if (tenPercent < 10) //if 10% of purchase total is less than 10$ then donationAmount is 10$
    {
        donationAmount = 10;
        donationType = "Minimum";
    }
    var totalWithDonation = totalBeforeDonate + donationAmount; //calculate final total including donation
    purchaseReceiptTable += //add to existing table template with new row showing the donation amount and whether it was the minimum or a percentage of the purchase
    `<tr>
    <td>Donation</td>
    <td colspan=\"2\">${donationType}</td>
    <td>\$${donationAmount.toFixed(2)}</td>
    <tr>
    <tr>
    <th colspan=\"3\">Total</th>
    <th>\$${totalWithDonation.toFixed(2)}</th>
    </tr>
    </table>`;
    document.getElementById('mainContentSection').innerHTML += purchaseReceiptTable; //output the finished table template by adding it to the existing content inside of the fieldset
    document.getElementById('body').innerHTML += `<br><a href=\"javascript:location.reload();\" id=\"goBackLink\">Click Here to Go Back</a>`;
}