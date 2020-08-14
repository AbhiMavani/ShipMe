#include <stdio.h>

int main(void) 
{
    int t;
    long long n;
    scanf("%d",&t);
    while(t--)
    {
        scanf("%lld",&n);
        if((n%5)==0)
        {
            if((n%2)!=0)
            {
                printf("1\n");
            }
            else
            {
                printf("0\n");
            }
            
        }
        if((n%5)!=0)
        {
            printf("-1\n");
        }
        
    }
    
	return 0;
}

