const { calculateImpact } = require('../routes/donar_Engagement');

describe('Donor Engagement Component', () => {
  test('should correctly calculate impact for material donors', () => {
    // Mocked data for testing
    const materialDonor = {
      name: 'John Doe',
      donatedItems: [
        { type: 'bicycle', quantity: 2 },
        { type: 'computer', quantity: 1 }
      ]
    };

    const impact = calculateImpact(materialDonor);

    
    expect(impact).toBe(3); 
  });
});
