#include <bits/stdc++.h>
using namespace std;

//stores{type, row->freq
map<pair<int, int>, int>r;
map<pair<int, int>, int>c;

bool help(int row, int col, int num, vector<vector<int>>&res){
    int n=res.size();

    //check row
    if(row-2>=0 && res[row-2][col]==num && res[row-1][col]==num) return false;

    if(row-1>=0 && row+1<n && res[row-1][col]==num && res[row+1][col]==num) return false;

    if(row+2<n && res[row+2][col]==num && res[row+1][col]==num) return false;

    //check col
    if(col-2>=0 && res[row][col-2]==num && res[row][col-1]==num) return false;

    if(col-1>=0 && col+1<n && res[row][col-1]==num && res[row][col+1]==num) return false;

    if(col+2<n && res[row][col+2]==num && res[row][col+1]==num) return false;

    //check freq
    if(r[{num,row}]>=n/2) return false; 
    
    if(c[{num,col}]>=n/2) return false;

    return true;
}

bool solve(int row, int col, vector<vector<int>>&res){
    int n=res.size();

    if(col==n){
        for(int i=0; i<n; i++){
            if(r[{1, i}]!=r[{-1, i}]) return false;

            if(c[{1, i}]!=c[{-1, i}]) return false;
        }
        return true;
    }

    int nr=(row==n-1)?0: row+1;
    int nc=(row==n-1)?col+1:col;

    if(res[row][col]!=0) return solve(nr, nc, res);

    if(help(row, col, -1, res)){
        r[{-1, row}]++; c[{-1, col}]++; res[row][col]=-1;

        if(solve(nr, nc, res)) return true;
        r[{-1, row}]--; c[{-1, col}]--; res[row][col]=0;
    }
    if(help(row, col, 1, res)){
        r[{1, row}]++; c[{1, col}]++; res[row][col]=1;

        if(solve(nr, nc, res)) return true;
        r[{1, row}]--; c[{1, col}]--; res[row][col]=0;
    }
    return false;
}

int main(){
        int n=6;
        vector<vector<int>>res(n, vector<int>(n, 0));
        for(int i=0; i<n; i++){
            for(int j=0; j<n; j++){
                if(res[i][j]) {r[{res[i][j], i}]++; c[{res[i][j], j}]++;}
            }
        }
        solve(0, 0, res);
}