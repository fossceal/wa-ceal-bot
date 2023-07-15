const prompts = [
    "who developed you?",
    "who created you?",
    "who built you?",
    "tell me about your developers?",
    "who created you?",
    "any information about your creators?",
    "details on the team behind your development?",
    "can you share the names of those who developed you?",
    "who was involved in your creation?",
    "what organizations were responsible for developing you?",
    "who are your developers?",
    "who built you?",
    "tell me about the people behind your development?"
];

exports.processPrompt = async (message) => {
    let msg = message.toString();
    let processedPrompt = msg.toLowerCase();
    processedPrompt = msg.charAt(msg.length-1) !== "?" ? processedPrompt + "?" : processedPrompt;
    if (prompts.includes(processedPrompt.toString())) {
        return `🤖\n\nI was developed by the team at *Foss Ceal* to serve students and faculties under *College of Engineering Attingal* 🙃\n\nIf you really like my existence,then feel free to contribute to my source code so that i can serve you better\n\ngithub: https://github.com/FOSS-CEAL/wa-ceal-bot`
    } else {
        return null;
    }
}