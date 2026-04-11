#include <stdio.h>
#include <string.h>

//-----------------------------------------------
double average(char *str)
{
	//Begin your statements here
    double avg = 0;
   
	//End your statements
    return avg;
}

//==========DO NOT ADD NEW OR CHANGE STATEMENTS IN THE MAIN FUNCTION========
int main()
{
  	system("cls");
  	printf("TEST Q4 (3 marks)\n");
  	char s[31];
  	double avg;
    printf("Enter string:");
    scanf("%30[^\n]",s);
    printf("OUTPUT:\n");
    avg = average(s);
    printf("%.2lf\n", avg);
    printf("\n");
  	system("pause");
  	return 0;
  	//============================================================
}

