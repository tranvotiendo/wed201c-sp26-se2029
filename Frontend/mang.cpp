#include "stdio.h"

int main(){
	// Khai bao mang
	int a[10];
	float b[100];
	char c[1000];
	
	// Khai bao mang va gan gia tri ban dau
	int x[10] = {};
	int y[3]= {9, 6, 15};
	
	// Gan du lieu cho mang
	// Mang bat dau tu vi tri so 0
	y[1]=10;
	
	printf("\n0 - %d", y[0]);
	printf("\n1 - %d", y[1]);
	printf("\n2 - %d", y[2]);	
}