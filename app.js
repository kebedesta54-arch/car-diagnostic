
document.getElementById('symptomForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const checked = Array.from(document.querySelectorAll('input[name="symptom"]:checked'))
                        .map(cb => cb.value);
    let resultText = "";
    if (checked.length === 0) {
        resultText = "אנא בחר לפחות סימפטום אחד.";
    } else {
        resultText = "אבחנה ראשונית: ";
        if (checked.includes("engine")) resultText += "\n- ייתכן שיש בעיה במערכת ההצתה או המצבר.";
        if (checked.includes("brakes")) resultText += "\n- בדוק רפידות ודיסקים בבלמים.";
        if (checked.includes("ac")) resultText += "\n- ייתכן שחסר גז במערכת המיזוג.";
        if (checked.includes("lights")) resultText += "\n- בדוק פיוזים ונורות.";
    }
    document.getElementById('result').innerText = resultText;
});
