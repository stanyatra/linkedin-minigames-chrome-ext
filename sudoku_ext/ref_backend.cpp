#include <bits/stdc++.h>
using namespace std;

//mini sudoko solver-> 6x6 (2x3 boxes)

int r[6]={};
int c[6]={};
int b[6]={};

bool help(int row, int col, int num, vector<vector<int>>&mat){
    int reg=2*(row/2)+(col/3);

    int mask=(1<<num);

    //row check
    if(r[row] & mask) return false;

    //col check
    if(c[col] & mask) return false;

    //2x3 box check
    if(b[reg] & mask) return false;
    return true;
}
bool solve(int row, int col, vector<vector<int>>&mat){
    if(col==6) return true;

    int reg=2*(row/2)+(col/3);

    int nr=(row==5)?0:row+1;
    int nc=(row==5)?col+1:col;

    if(mat[row][col]) return solve(nr, nc, mat);

    for(int num=1; num<=6; num++){
        if(help(row, col, num, mat)){
            int mask=(1<<num);
            r[row] |= mask; c[col] |= mask; b[reg] |= mask; //bitmasking
            mat[row][col]=num;
            if(solve(nr, nc, mat)) return true;
            mat[row][col]=0;
            r[row] ^= mask; c[col] ^= mask; b[reg] ^= mask; //bitmasking
        }
    }
    return false;
    
    
}
int main(){
    vector<vector<int>>mat(6, vector<int>(6, 0));

    for(int i=0; i<6; i++){
        for(int j=0; j<6; j++){
            int mask=(1<<mat[i][j]); //bitmasking
            int reg=2*(i/2)+(j/3);
            r[i] |= mask; c[j] |= mask; b[reg] |= mask;
        }
    }

    solve(0, 0, mat);

}