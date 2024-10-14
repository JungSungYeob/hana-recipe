export default function RecipeDetail() {
  return (
    <>
      <div>
        <h1>title</h1>
        <div>
          <h2>조리 과정</h2>
          <div>
            <h3>Step ~~~</h3>
						<button>
							시간 (초)
						</button>
						<button>
							타이머 시작
						</button>
          </div>
        </div>
				<div>
					<small>hashtag</small>
				</div>
				<div>
					<h3>재료</h3>
					<ul>
						<li>Ingredient1</li>
					</ul>
				</div>
				<div>
					<h3>수정 기록</h3>
					<ul>
						<li>
							<p>Version</p>
							<p>Date</p>
							<button>이 버전으로 복원</button>
						</li>
					</ul>
				</div>
				<div>
					<button>
						수정
					</button>
					<button>
						삭제
					</button>
					<button>
						목록
					</button>
				</div>
      </div>
    </>
  );
}
