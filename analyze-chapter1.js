const fs = require('fs');

const data = JSON.parse(fs.readFileSync('extracted-history/final-cleaned-chapters.json', 'utf8'));
const ch1 = data.chapters[0].content;

console.log('Chapter 1 analysis:');
console.log(`Total length: ${ch1.length} chars`);
console.log('\nLooking for where actual content starts...\n');

// Search for key phrases that indicate actual chapter content
const markers = {
    'ਆਪਣੀ ਥਾਂ ਖ਼ੁਦ-ਮੁਖ਼ਤਿਆਰ ਸਨ': 'rulers were independent',
    'ਹਾਕਮ ਤੇ ਉਹਨਾਂ ਦੇ': 'rulers and their officials',
    'ਇਹਨਾਂ ਵਿੱਚੋਂ ਹਰੇਕ': 'each one of them',
    'ਰਾਜੇ ਸ਼ੀਂਹ ਮੁਕਦਮ ਕੁਤੇ': 'kings tigers officials dogs'
};

Object.entries(markers).forEach(([phrase, meaning]) => {
    const pos = ch1.indexOf(phrase);
    if (pos >= 0) {
        console.log(`Found "${phrase}" (${meaning})`);
        console.log(`  Position: ${pos}`);
        console.log(`  Context (50 chars before, 100 after):`);
        console.log(`  ${ch1.substring(Math.max(0, pos - 50), pos + 150)}`);
        console.log('');
    }
});

// Show content structure
console.log('\n' + '='.repeat(60));
console.log('First 1000 characters of Chapter 1:');
console.log('='.repeat(60));
console.log(ch1.substring(0, 1000));
