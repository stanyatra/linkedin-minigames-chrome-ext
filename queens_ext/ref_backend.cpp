#include <bits/stdc++.h>
#include <fstream>
using namespace std;

bool help(int row, int col, vector<vector<int>>&temp, vector<vector<int>>&res, map<int, int>&mp){
    int n=res.size();
    //check neighbour
    int nr=row; int nc=col;

    for(int dr=-1; dr<=1; dr++){
        for(int dc=-1; dc<=1; dc++){
            if(!dr && !dc) continue;

            int r=row+dr; int c=col+dc;
            if(r>=0 && r<n && c>=0 && c<n){
                if(temp[r][c]==1) return false;
            }
        }
    }
    //check col
    while(nc>=0){
        if(temp[nr][nc]==1) return false;
        nc--;
    }

    //check color
    if(mp[res[row][col]]) return false;

    return true;

}

void solve(int col, vector<vector<int>>&temp, vector<vector<int>>&res, map<int, int>&mp, vector<vector<vector<int>>>&ans){
    int n=res.size();

    if(col==n){
        ans.push_back(temp); return;
    }

    for(int row=0; row<n; row++){
        if(help(row, col, temp, res, mp)){
            temp[row][col]=1;
            mp[res[row][col]]=1;
            solve(col+1, temp, res, mp, ans);
            mp[res[row][col]]=0;
            temp[row][col]=0;
        }
    }
}

int main(){
    ifstream fin("input.txt");
    ofstream fout("output.txt");

    int n;
    fin >> n;

    
    vector<vector<int>> res(n, vector<int>(n));
    for(int i=0; i<n; i++){
        for(int j=0; j<n; j++){
            fin>>res[i][j];
        }
    }
    
    vector<vector<int>>temp(n, vector<int>(n, 0));
    map<int, int>mp;
    vector<vector<vector<int>>>ans;
    solve(0, temp, res, mp, ans);
    
    for(auto row: ans[0]){
        for(auto val: row){
            fout<<val<<" ";
        }
        fout<<endl;
    }
}