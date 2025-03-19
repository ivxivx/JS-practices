

function switch_true(school: string, mark: number): string {
  switch (true) {
    case (school === 'school1' && mark >= 0 && mark < 50):
      return 'Fail';
    case (school === 'school1' && mark >= 50 && mark < 60):
      return 'D';
    case (school === 'school1' && mark >= 60 && mark < 70):
      return 'C';
    case (school === 'school1' && mark >= 70 && mark < 80):
      return 'B';
    case (school === 'school1' && mark >= 80 && mark <= 100):
      return 'A';
    case (school === 'school2' && mark >= 0 && mark < 60):
      return 'Fail';
    case (school === 'school2' && mark >= 60 && mark < 70):
      return 'C';
    case (school === 'school2' && mark >= 70 && mark < 80):
      return 'B';
    case (school === 'school2' && mark >= 80 && mark <= 100):
      return 'A';
    default:
      return 'Invalid mark';
    }
}
