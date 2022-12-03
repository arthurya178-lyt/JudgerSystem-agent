#ifndef BMI_H
#define BMI_H
#include <string>
using namespace std;
class BMI
{
public:
    BMI(string, double, double);
    void setName(string);
    string getName();
    void setWeight(double);
    double getWeight();
    void setHeight(double);
    double getHeight();
    double getBMI();
private:
    string name;
    double weight;
    double height;
};
#endif