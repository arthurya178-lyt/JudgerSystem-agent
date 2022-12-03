#include <iostream>
#include <iomanip>
#include <string>
#include "BMI.h"
using namespace std;

int main()
{
	string name;
	double weight, height;
	cin >> name >> weight >> height;
	BMI bmi(name, weight, height);
	cout << fixed << setprecision(2) << bmi.getName() << " " << bmi.getBMI();
	return 0;
}
