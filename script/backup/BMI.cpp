#include "BMI.h"
BMI::BMI(string n, double w, double h)
{
    name = n;
    weight = w;
    height = h;
}
void BMI::setName(string n)
{
    name = n;
}
string BMI::getName()
{
    return name;
}
void BMI::setWeight(double w)
{
    weight = w;
}
double BMI::getWeight()
{
    return weight;
}
void BMI::setHeight(double h)
{
    height = h;
}
double BMI::getHeight()
{
    return height;
}
double BMI::getBMI()
{
    return weight / (height * height);
}