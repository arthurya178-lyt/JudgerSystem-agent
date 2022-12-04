#include <iostream>
#include <string>
using namespace std;

string maxSubString(string val1,string val2)
{
	int a,b,c,counter=0,max=0; //c 算陣列長度 

	a=(1+val1.size())*val1.size()/2; //算陣列有幾種可能 
	b=(1+val2.size())*val2.size()/2;
	
	int t[a];
	string s[a],s1[b],res[a];
	c=val1.size();
	for(int i=0;i<a;i++)            // 排出所有val1陣列的可能性並存到s[i] 
	{                               //舉例 val1=god  則可能有g go god o od d這些 
		for(int j=0;j<=counter;j++)
		{
				s[i]+=val1[j];
		}                          //god中g為第一項 o為第二項 d為第三項

		if(i<c-1){                  //計算最前面那項的所有組合是否已出現 
			counter++;			   // 否 繼續算 
		}	
		else
		{
			val1=val1.erase(0,1);  //是 刪掉最前面那項 
			c+=val1.size();
			counter=0;
		}
	}
	c=val2.size();                 //換算val2 
	for(int i=0;i<b;i++)
	{
		for(int j=0;j<=counter;j++)
		{
				s1[i]+=val2[j];
		}
		if(i<c-1)
			counter++;
		else
		{
			val2=val2.erase(0,1);
			c+=val2.size();
			counter=0;
		}
	}
	for(int i=0;i<a;i++)     
	{
		for(int j=0;j<b;j++)
		{
			if(s[i]==s1[j])        //把val1和val2個別 所有的可能性進行比對看是否有相同 
			{
				res[counter]=s[i]; //把相同的存起來 //ex.YZAABCCX YZABABCCX res陣列就會有YZA,ABCCX,Y,A,Z,B,C,X 
				counter++;
			}
		}
	}
	for(int i=0;i<counter;i++){                  
		t[i]=res[i].size();                       
		if(max<res[i].size()) max=res[i].size();  //計算最長的 
	}
	for(int i=0;i<counter;i++){
		if(max==t[i])            //找最長的在第幾位 
		{
			return 	res[i];      //return結果 
		}
	}
	
}

int main()
{
	string val1, val2;
	for (int i = 1; i <= 10; i++)
	{
		getline(cin, val1);
		getline(cin, val2);
		cout << "Test" << i << ": " << maxSubString(val1, val2) << endl;
	}
}
