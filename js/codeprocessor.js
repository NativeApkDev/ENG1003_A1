/**
 * Codeprocessor.js performs backend code processing of the received video stream data.
 * This data is then converted into a predefined human-readable format and displayed in the browser.
 *    For your reference...
 * 		event will hold an Event object with the pixels in
 *   	event.detail.data and the timestamp in event.timeStamp
 *
 *   Contributor:
 *   Tahaa Waseem
 *   Dominic Tjiptono
 *   Vicky Feliren
 */


// Declaring global variables

let red=0;
let green=0;
let blue=0;

var listening={
    tapgap:[],
    timing:[]
};
let output="";
let totaltime=0;
let code="";
let finalcode=[];

let rxcodeRef=document.getElementById("rx-code");
let rxtranslatedRef=document.getElementById("rx-translated");

/**
 * a function converting the received RGB
 array into grayscale. This should leave with
 the grayscale values for each pixel in the square tapped on the screen
 * @param value
 */
function greyscaleConverted(value)
{
    // Step 2: Conversion to grayscale
    for (let i=0; i<1600; i=i+4)
    {
        red+=value.detail.data[i];
        green+=value.detail.data[i+1];
        blue+=value.detail.data[i+2];
        // event.detail.data[i + 3] is ignored because it represents alpha values
    }

    /**
     * Calculating average value of red, green, and blue elements out of
     * 400 values of red, green, and blue taken in the 'event.detail.data' array
     * Average value of red, green, and blue for one square is (red + green + blue)/3
     * Hence, average value of red, green, and blue
     * for 400 squares = avg for one square/400
     *      = ((red + green + blue)/3)*(1/400)
     *      = (red + green + blue)/1200
     */
    avg=(red+green+blue)/1200;
    return avg
}


_listen = function(event)
{
    convertedToGreyscale=greyscaleConverted(event);

    // Step 3: White/Black Duration
    if (convertedToGreyscale<(255/2))
        {
            listening.tapgap.push("Black"); // Black square detected
            listening.timing.push(event.timeStamp);
        }
    else
        {
            listening.tapgap.push("White"); // White square detected
            listening.timing.push(event.timeStamp);
        }

    listeninglength=listening.tapgap.length;
    code="";

    // Checking each element of the 'listening' array
    for(let i=0; i<listeninglength; i++)
        {
            if(listening.tapgap[i]=="Black")
                {
                    if (code!=="")
                        {
                            totaltime+=listening.timing[i]-listening.timing[i-1];
                        }
                }
            else if(listening.tapgap[i]=="White")
                {
                    if(listening.tapgap[i-1]!=="White")
                        {
                            code+="*";
                            totaltime=0;
                            // The white square represents a tap
                        }
                }

            /**
             * Step 4: Determining whether the black square represents a half-gap
             * or a full-gap by checking the value of 'totaltime'
             */
            if (totaltime>450 && totaltime<600)
                {
                    code+=" ";
                }
        }
    // Resetting values of red, green, and blue to 0
    red=0;
    green=0;
    blue=0;
};

/*
 * Resets all the data to be able to for call the listen function once again
 */
clear = function()
{
    // Resetting the current state message
    red=0;
    green=0;
    blue=0;

    listening={
        tapgap:[],
        timing:[]
    };
    output="";
    totaltime=0;
    code="";
    finalcode=[];

    // Showing empty strings for 'code' and 'output' variables in the website
    rxcodeRef.innerHTML=code;
    rxtranslatedRef.innerHTML=output;
};

/*
 *Translates the tap code into human-readable format and display the results in the inner HTML tag
 */
translate = function()
{
    // Step 1: Using data type 2D Array to store the 25 characters
    const characters=[
        ["e","t","a","n","d"],
        ["o","i","r","u","c"],
        ["s","h","m","f","p"],
        ["l","y","g","v","j"],
        ["w","b","x","q","z"]
    ];

    if(listening.tapgap[listening.tapgap.length-1]==="White")
    {
        alert("Error! The last screen of the message was white.")
    }
    else {
        /**
         *Step 5: Conversion to characters
         *Showing the original code as an output (Step 8)
         */
        rxcodeRef.innerHTML = code;
        code = code.split(" ");
        for (let j = 0; j < code.length; j++) {
            if (code[j] !== "") {
                finalcode.push(code[j].length);
            }
        }
        if(finalcode.length % 2 === 0){
            for (let i = 0; i < finalcode.length; i += 2) {
                output += characters[finalcode[i] - 1][finalcode[i + 1] - 1];
            }
        }
        /** Since each letter is represented by two alternative codes, there must be an
        * an even number of codes. So, if the number of codes is odd, this means that the 
        * message was terminated earlier, hence error.
        */
        else {
            alert ("Error! The message was terminated early.")
        }
        // Step 7: Convert special characters which are not in the 'characters' array (i.e. spaces and "k")
        output = output.replace(/wuw/g, " ");
        output = output.replace(/qc/g, "k");

        // Showing the translated code as an output (Step 8)
        rxtranslatedRef.innerHTML = output;
    }
};