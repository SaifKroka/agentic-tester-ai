// reporter.js
function generateReport(results) {
  console.log("\n=== AI Testing Report ===\n");
  
  // Ensure results is always an array
  if (!Array.isArray(results)) {
    console.error("❌ Invalid results format:", results);
    return;
  }

  results.forEach((result, idx) => {
    console.log(`Test #${idx + 1}`);
    console.log(`Prompt:    ${result.prompt || 'N/A'}`);
    console.log(`Expected:  ${result.expected || 'N/A'}`);
    
    // Safely handle response
    const response = result.response ? 
      (typeof result.response === 'string' ? result.response.trim() : JSON.stringify(result.response)) : 
      'No response received';
      
    console.log(`Response:  ${response}`);
    console.log(`Passed:    ${result.passed ? "✅" : "❌"}`);
    console.log('-----------------------------');
  });
  
  const passedCount = results.filter(r => r.passed).length;
  console.log(`Summary: Passed ${passedCount} out of ${results.length} tests.\n`);
}

module.exports = generateReport;